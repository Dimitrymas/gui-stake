package main

import (
	"context"
	"gui/pkg/telegram"
)

type App interface {
	startup(ctx context.Context)
	TgIsAuthorized() bool
	TgDeleteSession() string
	TgGetQrCode() *telegram.GetQrCodeResponse
	TgCancelQrLogin()
	TgLoginWithPassword(password string) string
	TgGetUserInfo() *telegram.ProfileResponse
	TgGetNameByPeerID(peerID int64) *telegram.GetNameResponse
	TgGetNameByUsername(username string) *telegram.GetNameResponse
}

// app struct
type app struct {
	ctx       context.Context
	tgService telegram.Service
}

// NewApp creates a new app application struct
func NewApp(tgService telegram.Service) App {
	return &app{
		tgService: tgService,
	}
}

// Startup is called at application startup
func (a *app) startup(ctx context.Context) {
	a.ctx = ctx

	// Set the context for the telegram service
	a.tgService.SetContext(ctx)
}

func (a *app) TgIsAuthorized() bool {
	return a.tgService.IsAuthorized()
}

func (a *app) TgDeleteSession() string {
	return a.tgService.DeleteSession()
}

func (a *app) TgGetQrCode() *telegram.GetQrCodeResponse {
	return a.tgService.GetQrCode()
}

func (a *app) TgCancelQrLogin() {
	a.tgService.CancelQrLogin()
}

func (a *app) TgLoginWithPassword(password string) string {
	return a.tgService.LoginWithPassword(password)
}

func (a *app) TgGetUserInfo() *telegram.ProfileResponse {
	return a.tgService.GetUserInfo()
}

func (a *app) TgGetNameByPeerID(peerID int64) *telegram.GetNameResponse {
	return a.tgService.GetNameByPeerID(peerID)
}

func (a *app) TgGetNameByUsername(username string) *telegram.GetNameResponse {
	return a.tgService.GetNameByUsername(username)
}
