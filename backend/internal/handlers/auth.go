package handlers

import (
	"encoding/json"
	"net/http"

	"esimde-backend/internal/config"
	"esimde-backend/internal/database"
	"esimde-backend/internal/dto"
	"esimde-backend/internal/middleware"
	"esimde-backend/internal/models"
	"esimde-backend/internal/utils"
)

type AuthHandler struct {
	cfg *config.Config
}

func NewAuthHandler(cfg *config.Config) *AuthHandler {
	return &AuthHandler{cfg: cfg}
}

// POST /api/v1/auth/send-otp
func (h *AuthHandler) SendOTP(w http.ResponseWriter, r *http.Request) {
	var req dto.OTPSendRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"detail":"Invalid JSON format"}`, http.StatusBadRequest)
		return
	}

	if req.Phone == "" && req.Email == "" {
		http.Error(w, `{"detail":"Phone or email required"}`, http.StatusBadRequest)
		return
	}

	devCode := "1234"
	resp := dto.OTPSendResponse{
		Message: "Код подтверждения отправлен",
	}
	if h.cfg.DevAuthVisible || true { // default dev code for testing
		resp.DevCode = devCode
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// POST /api/v1/auth/verify-otp
func (h *AuthHandler) VerifyOTP(w http.ResponseWriter, r *http.Request) {
	var req dto.OTPVerifyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"detail":"Invalid JSON format"}`, http.StatusBadRequest)
		return
	}

	if req.Code == "" {
		http.Error(w, `{"detail":"Code is required"}`, http.StatusBadRequest)
		return
	}

	normPhone := utils.NormalizePhone(req.Phone)

	var user models.User
	err := database.DB.Where("phone = ? OR email = ?", normPhone, req.Email).First(&user).Error
	if err != nil {
		// Auto-register user if not existing
		user = models.User{
			Phone:    normPhone,
			Email:    req.Email,
			Timezone: "Asia/Almaty",
		}
		database.DB.Create(&user)
	}

	tokenStr, err := utils.GenerateJWT(user.ID, h.cfg.JWTSecret)
	if err != nil {
		http.Error(w, `{"detail":"Token generation error"}`, http.StatusInternalServerError)
		return
	}

	userShort := &dto.UserShort{
		ID:         user.ID,
		FirstName:  user.FirstName,
		LastName:   user.LastName,
		MiddleName: user.MiddleName,
		Email:      user.Email,
		Phone:      user.Phone,
		IsDoctor:   user.IsDoctor,
		IsAdmin:    user.IsAdmin,
		AvatarPath: user.AvatarPath,
	}

	tokenResp := dto.TokenResponse{
		AccessToken:     tokenStr,
		TokenType:       "bearer",
		UserID:          user.ID,
		IsDoctor:        user.IsDoctor,
		IsAdmin:         user.IsAdmin,
		ProfileComplete: user.FirstName != "" && user.LastName != "",
		User:            userShort,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tokenResp)
}

// POST /api/v1/auth/login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req dto.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"detail":"Invalid JSON format"}`, http.StatusBadRequest)
		return
	}

	var user models.User
	err := database.DB.Where("username = ? OR email = ?", req.Username, req.Username).First(&user).Error
	if err != nil || (user.Password != "" && !utils.CheckPasswordHash(req.Password, user.Password)) {
		http.Error(w, `{"detail":"Неверный логин или пароль"}`, http.StatusUnauthorized)
		return
	}

	tokenStr, err := utils.GenerateJWT(user.ID, h.cfg.JWTSecret)
	if err != nil {
		http.Error(w, `{"detail":"Token generation error"}`, http.StatusInternalServerError)
		return
	}

	userShort := &dto.UserShort{
		ID:         user.ID,
		FirstName:  user.FirstName,
		LastName:   user.LastName,
		MiddleName: user.MiddleName,
		Email:      user.Email,
		Phone:      user.Phone,
		IsDoctor:   user.IsDoctor,
		IsAdmin:    user.IsAdmin,
		AvatarPath: user.AvatarPath,
	}

	tokenResp := dto.TokenResponse{
		AccessToken:     tokenStr,
		TokenType:       "bearer",
		UserID:          user.ID,
		IsDoctor:        user.IsDoctor,
		IsAdmin:         user.IsAdmin,
		ProfileComplete: true,
		User:            userShort,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tokenResp)
}

// GET /api/v1/auth/me
func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetCurrentUser(r)
	if user == nil {
		http.Error(w, `{"detail":"Unauthorized access"}`, http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
