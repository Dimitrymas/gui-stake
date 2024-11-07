package telegram

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"github.com/amarnathcjd/gogram/telegram"
	"github.com/labstack/gommon/log"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"gui/pkg/customerrors"
	"os"
	"strconv"
	"strings"
	"sync"
)

type Service interface {
	IsAuthorized() bool
	DeleteSession() string
	GetQrCode() *GetQrCodeResponse
	CancelQrLogin()
	LoginWithPassword(password string) string
	GetUserInfo() *ProfileResponse
	SetContext(ctx context.Context)
	GetNameByPeerID(peerID int64) *GetNameResponse
	GetNameByUsername(username string) *GetNameResponse
}

type service struct {
	ctx       context.Context
	client    *telegram.Client
	ctxCancel context.CancelFunc
	mu        sync.Mutex
}

func NewService() (Service, error) {
	s := &service{}
	err := s.ReClient()
	log.Info("Создание нового сервиса")
	if err != nil {
		log.Error(fmt.Sprintf("Ошибка при создании нового клиента: %v", err))
		return nil, err
	}
	return s, nil
}

func (s *service) SetContext(ctx context.Context) {
	s.ctx = ctx
}

func (s *service) ReClient() error {
	log.Info("Создание нового клиента")
	client, err := telegram.NewClient(telegram.ClientConfig{
		AppID:    16374565,
		AppHash:  "c1c82eb36924c427b34387af6ca6a33c",
		LogLevel: telegram.LogInfo,
	})
	if err != nil {
		return err
	}
	client, err = client.Conn()
	if err != nil {
		return err
	}
	s.client = client
	return nil
}

func (s *service) IsAuthorized() bool {
	isAuthorized, err := s.client.IsAuthorized()
	if err != nil || !isAuthorized {
		// delete session
		err = os.Remove("session.dat")
		if err != nil {
			log.Error(fmt.Sprintf("Ошибка при удалении файла сессии: %v", err))
			return false
		}
		err = s.ReClient()
		if err != nil {
			log.Error(fmt.Sprintf("Ошибка при создании нового клиента: %v", err))
			return false
		}
		return false
	}
	return isAuthorized
}

func (s *service) DeleteSession() string {
	err := s.client.DeleteSession()
	if err != nil {
		return err.Error()
	}
	err = s.ReClient()
	if err != nil {
		return err.Error()
	}
	return ""
}

func (s *service) recreateQrToken(token *telegram.QrToken) error {
	newToken, err := token.Recreate()
	if err != nil {
		runtime.EventsEmit(s.ctx, QrErrorEvent, err.Error())
		return err
	}
	runtime.EventsEmit(s.ctx, QrRecreateEvent, &QrRecreateResponse{
		QrUrl: newToken.URL(),
		Error: "",
	})
	return nil
}

func (s *service) GetQrCode() *GetQrCodeResponse {
	token, err := s.client.QRLogin()
	if err != nil {
		return &GetQrCodeResponse{
			QrCode: "",
			Error:  err.Error(),
		}
	}

	s.CancelQrLogin()

	ctx, cancel := context.WithCancel(s.ctx)

	s.mu.Lock()
	s.ctxCancel = cancel
	s.mu.Unlock()

	go s.qrLoginLoop(ctx, token)

	return &GetQrCodeResponse{
		QrCode: token.URL(),
		Error:  "",
	}
}

func (s *service) CancelQrLogin() {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.ctxCancel != nil {
		s.ctxCancel()
		s.ctxCancel = nil
	}
}

func (s *service) qrLoginLoop(ctx context.Context, token *telegram.QrToken) {
	for {
		select {
		case <-ctx.Done():
			s.CancelQrLogin()
			return
		default:
			err := s.WaitQrCode(token)
			if err != nil {
				switch {
				case errors.Is(err, customerrors.ErrTelegramQrLoginTimeout):
					err = s.recreateQrToken(token)
					if err != nil {
						return
					}
				case errors.Is(err, customerrors.ErrTelegram2FA):
					runtime.EventsEmit(s.ctx, Qr2FARequiredEvent)
					return
				default:
					runtime.EventsEmit(s.ctx, QrErrorEvent, err.Error())
					return
				}
			} else {
				runtime.EventsEmit(s.ctx, QrLoggedInEvent)
				return
			}
		}
	}
}

func (s *service) WaitQrCode(token *telegram.QrToken) error {
	err := token.Wait(30)
	if err != nil {
		if strings.Contains(err.Error(), customerrors.ErrTelegramQrLoginTimeout.Error()) {
			return customerrors.ErrTelegramQrLoginTimeout
		} else if strings.Contains(err.Error(), customerrors.ErrTelegram2FA.Error()) {
			return customerrors.ErrTelegram2FA
		} else {
			return err
		}
	}
	return nil
}

func (s *service) LoginWithPassword(password string) string {
	accPass, err := s.client.AccountGetPassword()
	if err != nil {
		log.Error("Ошибка при запросе пароля: ", err)
		return err.Error()
	}
	inputPass, err := telegram.GetInputCheckPassword(password, accPass)
	if err != nil {
		log.Error("Ошибка при подписи: ", err)
		return err.Error()
	}
	_, err = s.client.AuthCheckPassword(inputPass)
	if err != nil {
		if strings.Contains(err.Error(), customerrors.ErrPasswordHashInvalid.Error()) {
			log.Error("Ошибка при проверке пароля: ", err)
			return "Password is invalid"
		} else {
			log.Error("Ошибка при проверке пароля: ", err)
			return err.Error()
		}
	}
	runtime.EventsEmit(s.ctx, QrLoggedInEvent)
	return ""
}

func (s *service) GetUserInfo() *ProfileResponse {
	// check if user in cache
	var user *telegram.UserObj
	var err error

	user = s.client.Me()
	if user == nil {
		user, err = s.client.GetMe()
		if err != nil {
			log.Error(err)
			panic(err)
		}
	}

	cachedResp, err := getProfileFromDisk(strconv.FormatInt(user.ID, 10))
	if err == nil {
		return cachedResp
	}

	profilePhoto, err := s.getProfilePhoto()
	if err != nil {
		log.Error(err)
		panic(err)
	}
	avatar, err := avatarFromBuffer(profilePhoto)
	if err != nil {
		log.Error(err)
		panic(err)
	}

	resp := &ProfileResponse{
		LastName:  user.LastName,
		FirstName: user.FirstName,
		Avatar:    avatar,
	}
	// сохранить в папку ./profiles с именем user.ID.json
	log.Info("Сохранение профиля в файл")
	err = saveProfile(resp, strconv.FormatInt(user.ID, 10))
	if err != nil {
		log.Error(err)
		panic(err)
	}
	return resp
}

func (s *service) getProfilePhoto() (*bytes.Buffer, error) {
	info, err := s.client.UsersGetFullUser(&telegram.InputUserSelf{})
	if err != nil {
		return nil, err
	}

	userPhotoObj := info.FullUser.ProfilePhoto.(*telegram.PhotoObj)
	if userPhotoObj.VideoSizes != nil && len(userPhotoObj.VideoSizes) > 0 {
		userPhotoObj.VideoSizes = userPhotoObj.VideoSizes[:len(userPhotoObj.VideoSizes)-1]
	} else {
		userPhotoObj.Sizes = userPhotoObj.Sizes[:len(userPhotoObj.Sizes)-1]
	}

	userPhoto := &telegram.UserPhoto{
		Photo: userPhotoObj,
	}

	var buf bytes.Buffer
	_, err = s.client.DownloadMedia(*userPhoto, &telegram.DownloadOptions{
		Buffer: &buf,
	})
	if err != nil {
		return nil, err
	}

	return &buf, nil
}

func (s *service) GetNameByPeerID(peerID int64) *GetNameResponse {
	peerIDStr := strconv.FormatInt(peerID, 10)
	if strings.HasPrefix(peerIDStr, "-100") {
		peerIDStr = strings.TrimPrefix(peerIDStr, "-100")
	}

	formatedPeerID, err := strconv.Atoi(peerIDStr)
	if err != nil {
		return &GetNameResponse{
			Name:  "",
			Error: "Invalid channel ID",
		}
	}

	req := []telegram.InputChannel{
		&telegram.InputChannelObj{
			ChannelID:  int64(formatedPeerID),
			AccessHash: 0,
		},
	}

	messageChats, err := s.client.ChannelsGetChannels(req)
	if err != nil {
		return &GetNameResponse{
			Name:  "",
			Error: "You might not be in the channel, or it doesn’t exist.",
		}
	}
	var name string

	chats := messageChats.(*telegram.MessagesChatsObj).Chats

	if len(chats) == 0 {
		return &GetNameResponse{
			Name:  "",
			Error: "You might not be in the channel, or it doesn’t exist.",
		}
	}

	channel, ok := chats[0].(*telegram.Channel)
	if !ok {
		chat := chats[0].(*telegram.ChatObj)
		name = chat.Title
	} else {
		name = channel.Title
	}

	return &GetNameResponse{
		Name:  name,
		Error: "",
	}
}

func (s *service) GetNameByUsername(username string) *GetNameResponse {
	obj, err := s.client.ResolveUsername(username)
	if err != nil {
		return &GetNameResponse{
			Name:  "",
			Error: "Username not found",
		}
	}

	var name string

	switch obj.(type) {
	case *telegram.UserObj:
		user := obj.(*telegram.UserObj)
		name = user.FirstName + " " + user.LastName
	case *telegram.ChatObj:
		chat := obj.(*telegram.ChatObj)
		name = chat.Title
	case *telegram.Channel:
		channel := obj.(*telegram.Channel)
		name = channel.Title
	}

	return &GetNameResponse{
		Name:  name,
		Error: "",
	}
}
