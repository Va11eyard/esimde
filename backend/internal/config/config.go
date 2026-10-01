package config

import (
	"github.com/joho/godotenv"
	"os"
)

type Config struct {
	Port           string
	DatabaseURL    string
	JWTSecret      string
	DevAuthVisible bool
	OpenAIAPIKey   string
	PayLinkKey     string
	PayLinkSecret  string
	UploadDir      string
	WhatsAppPhone  string
	PublicAppURL   string
}

func LoadConfig() *Config {
	_ = godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/esimde?sslmode=disable"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "esimde-secret-super-key-2026"
	}

	uploadDir := os.Getenv("UPLOAD_DIR")
	if uploadDir == "" {
		uploadDir = "./uploads"
	}

	return &Config{
		Port:           port,
		DatabaseURL:    dbURL,
		JWTSecret:      jwtSecret,
		DevAuthVisible: os.Getenv("DEV_AUTH_VISIBLE") == "true",
		OpenAIAPIKey:   os.Getenv("OPENAI_API_KEY"),
		PayLinkKey:     os.Getenv("PAYLINK_KEY"),
		PayLinkSecret:  os.Getenv("PAYLINK_SECRET"),
		UploadDir:      uploadDir,
		WhatsAppPhone:  os.Getenv("WHATSAPP_PHONE"),
		PublicAppURL:   publicAppURL(),
	}
}

func publicAppURL() string {
	if url := os.Getenv("PUBLIC_APP_URL"); url != "" {
		return url
	}
	return "http://127.0.0.1:5174"
}
