package telegram

type AvatarResponse struct {
	Type string `json:"type"`
	B64  string `json:"b64"`
}

type ProfileResponse struct {
	FirstName string          `json:"first_name"`
	LastName  string          `json:"last_name"`
	Avatar    *AvatarResponse `json:"avatar"`
	Error     string          `json:"error"`
}

type QrRecreateResponse struct {
	Error string `json:"error"`
	QrUrl string `json:"qr_url"`
}

type DeleteSessionResponse struct {
	Error string `json:"error"`
}

type GetQrCodeResponse struct {
	QrCode string `json:"qr_code"`
	Error  string `json:"error"`
}

type GetNameResponse struct {
	Name  string `json:"name"`
	Error string `json:"error"`
}
