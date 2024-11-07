package main

import (
	"embed"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"gui/pkg/telegram"
	"log"
	"os"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

func main() {
	// Направить log в файл
	logFile, err := os.OpenFile("log.txt", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatal(err)
	}
	defer logFile.Close()

	log.SetOutput(logFile)

	defer func() {
		if r := recover(); r != nil {
			log.Printf("Приложение упало: %v", r)
		}
	}()

	// Create an instance of the app structure
	tgService, err := telegram.NewService()
	if err != nil {
		log.Fatal(err)
	}
	app := NewApp(tgService)
	// Create application with options
	err = wails.Run(&options.App{
		Title: "StakeAutoUse",
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 22, G: 28, B: 36, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		MinWidth:      1024,
		MinHeight:     768,
		DisableResize: false,
		Mac: &mac.Options{
			TitleBar: &mac.TitleBar{
				FullSizeContent: true, // включаем полноразмерный контент
			},
		},

		Windows: &windows.Options{
			DisableFramelessWindowDecorations: false, // оставляем возможные декорации
		},

		Linux: &linux.Options{
			WebviewGpuPolicy: linux.WebviewGpuPolicyAlways,
		},
	})

	if err != nil {
		log.Fatal(err)
	}
}
