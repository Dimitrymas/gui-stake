package customerrors

import "errors"

var (
	ErrTelegram2FA            = errors.New("SESSION_PASSWORD_NEEDED")
	ErrTelegramQrLoginTimeout = errors.New("qr login timed out")
	ErrPasswordHashInvalid    = errors.New("PASSWORD_HASH_INVALID")
	ErrTelegramUserNotFound   = errors.New("user not found")
	ErrCachedUserNotFound     = errors.New("cached user not found")
)
