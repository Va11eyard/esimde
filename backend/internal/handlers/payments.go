package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"esimde-backend/internal/database"
	"esimde-backend/internal/dto"
	"esimde-backend/internal/middleware"
	"esimde-backend/internal/models"
	"github.com/go-chi/chi/v5"
)

type PaymentsHandler struct{}

func NewPaymentsHandler() *PaymentsHandler {
	return &PaymentsHandler{}
}

// POST /api/v1/payments/create
func (h *PaymentsHandler) CreatePayment(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetCurrentUser(r)
	if user == nil {
		http.Error(w, `{"detail":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req dto.PaymentCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"detail":"Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	payment := models.Payment{
		AppointmentID:     req.AppointmentID,
		UserID:            user.ID,
		PaylinkOrderID:    fmt.Sprintf("order_%d_%d", req.AppointmentID, user.ID),
		PaylinkPaymentURL: "https://paylink.kz/pay/demo_esimde_checkout",
		Amount:            1500000, // 15000 KZT in tiyn
		Currency:          "KZT",
		Status:            models.PaymentPending,
	}

	database.DB.Create(&payment)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(payment)
}

// GET /api/v1/payments/status/{id}
func (h *PaymentsHandler) GetPaymentStatus(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, _ := strconv.Atoi(idStr)

	var payment models.Payment
	if err := database.DB.First(&payment, id).Error; err != nil {
		http.Error(w, `{"detail":"Payment not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(payment)
}
