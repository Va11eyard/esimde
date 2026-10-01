package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"esimde-backend/internal/database"
	"esimde-backend/internal/dto"
	"esimde-backend/internal/middleware"
	"esimde-backend/internal/models"
	"github.com/go-chi/chi/v5"
)

type AppointmentsHandler struct{}

func NewAppointmentsHandler() *AppointmentsHandler {
	return &AppointmentsHandler{}
}

// POST /api/v1/appointments
func (h *AppointmentsHandler) CreateAppointment(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetCurrentUser(r)
	if user == nil {
		http.Error(w, `{"detail":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req dto.AppointmentCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"detail":"Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	app := models.Appointment{
		PatientID: user.ID,
		DoctorID:  1, // default doctor or from slot
		Date:      time.Now().Add(24 * time.Hour),
		StartTime: "10:00",
		EndTime:   "11:00",
		Type:      "online",
		Status:    models.StatusConfirmed,
	}

	database.DB.Create(&app)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(app)
}

// GET /api/v1/appointments
func (h *AppointmentsHandler) ListAppointments(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetCurrentUser(r)
	if user == nil {
		http.Error(w, `{"detail":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var appointments []models.Appointment
	if user.IsDoctor {
		database.DB.Preload("Patient").Where("doctor_id = ?", user.ID).Find(&appointments)
	} else {
		database.DB.Preload("Doctor").Where("patient_id = ?", user.ID).Find(&appointments)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(appointments)
}

// POST /api/v1/appointments/{id}/conclusion
func (h *AppointmentsHandler) AddConclusion(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetCurrentUser(r)
	if user == nil || !user.IsDoctor {
		http.Error(w, `{"detail":"Doctor access required"}`, http.StatusForbidden)
		return
	}

	appIDStr := chi.URLParam(r, "id")
	appID, _ := strconv.Atoi(appIDStr)

	var req dto.ConclusionUpdateRequest
	_ = json.NewDecoder(r.Body).Decode(&req)

	var app models.Appointment
	if err := database.DB.First(&app, appID).Error; err != nil {
		http.Error(w, `{"detail":"Appointment not found"}`, http.StatusNotFound)
		return
	}

	conclusion := models.Conclusion{
		AppointmentID:              app.ID,
		PatientID:                  app.PatientID,
		DoctorID:                   user.ID,
		Complaints:                 req.Complaints,
		Diagnosis:                  req.Diagnosis,
		Medications:                req.Medications,
		DietRecommendations:        req.DietRecommendations,
		ExaminationRecommendations: req.ExaminationRecommendations,
	}

	database.DB.Save(&conclusion)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(conclusion)
}
