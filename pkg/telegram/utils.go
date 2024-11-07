package telegram

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/h2non/filetype"
	"gui/pkg/customerrors"
	"os"
)

func avatarFromBuffer(buf *bytes.Buffer) (*AvatarResponse, error) {
	// Определение типа файла
	kind, _ := filetype.Match(buf.Bytes())

	// Определяем тип медиа
	var mediaType string
	if kind.MIME.Type == "image" {
		mediaType = "img"
	} else if kind.MIME.Type == "video" {
		mediaType = "video"
	} else {
		return nil, fmt.Errorf("неподдерживаемый тип медиа")
	}

	// Преобразование данных в base64 строку
	base64String := base64.StdEncoding.EncodeToString(buf.Bytes())

	// Формирование строки для использования в src
	dataURL := fmt.Sprintf("data:%s;base64,%s", kind.MIME.Value, base64String)

	// Возвращаем объект с типом и base64 строкой
	return &AvatarResponse{
		Type: mediaType,
		B64:  dataURL,
	}, nil
}

func saveProfile(profileResponse *ProfileResponse, userID string) error {
	marshaled, err := json.Marshal(profileResponse)
	if err != nil {
		return err
	}

	// Создание папки если ее нет
	if _, err := os.Stat("./profiles"); os.IsNotExist(err) {
		err = os.Mkdir("./profiles", 0755)
		if err != nil {
			return err
		}
	}

	// Сохранение в файл
	err = os.WriteFile(fmt.Sprintf("./profiles/%s.json", userID), marshaled, 0644)
	return err
}

func getProfileFromDisk(userID string) (*ProfileResponse, error) {
	// Проверка наличия файла вернуть ошибку если его нет
	if _, err := os.Stat(fmt.Sprintf("./profiles/%s.json", userID)); os.IsNotExist(err) {
		return nil, customerrors.ErrCachedUserNotFound
	}

	// Чтение файла
	file, err := os.ReadFile(fmt.Sprintf("./profiles/%s.json", userID))
	if err != nil {
		err = os.Remove(fmt.Sprintf("./profiles/%s.json", userID))
		return nil, err
	}

	// Декодирование
	var profileResponse ProfileResponse
	err = json.Unmarshal(file, &profileResponse)
	if err != nil {
		err = os.Remove(fmt.Sprintf("./profiles/%s.json", userID))
		return nil, err
	}

	return &profileResponse, nil
}
