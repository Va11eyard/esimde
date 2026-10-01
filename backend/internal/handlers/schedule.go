package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"esimde-backend/internal/database"
	"esimde-backend/internal/models"
)

type ScheduleHandler struct{}

func NewScheduleHandler() *ScheduleHandler {
	return &ScheduleHandler{}
}

// GET /api/v1/schedule/availability
func (h *ScheduleHandler) GetAvailability(w http.ResponseWriter, r *http.Request) {
	var slots []models.Availability
	database.DB.Where("date >= ?", time.Now().Truncate(24*time.Hour)).Find(&slots)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(slots)
}

// POST /api/v1/schedule/availability
func (h *ScheduleHandler) CreateAvailability(w http.ResponseWriter, r *http.Request) {
	var slot models.Availability
	if err := json.NewDecoder(r.Body).Decode(&slot); err != nil {
		http.Error(w, `{"detail":"Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	database.DB.Create(&slot)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(slot)
}
