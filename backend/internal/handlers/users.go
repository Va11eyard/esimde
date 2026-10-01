package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"esimde-backend/internal/database"
	"esimde-backend/internal/dto"
	"esimde-backend/internal/middleware"
	"esimde-backend/internal/models"
	"github.com/go-chi/chi/v5"
)

type UsersHandler struct{}

func NewUsersHandler() *UsersHandler {
	return &UsersHandler{}
}

// GET /api/v1/users/doctors
func (h *UsersHandler) ListDoctors(w http.ResponseWriter, r *http.Request) {
	var doctors []models.User
	database.DB.Where("is_doctor = ?", true).Find(&doctors)

	var list []dto.DoctorListItem
	for _, d := range doctors {
		list = append(list, dto.DoctorListItem{
			ID:              d.ID,
			FirstName:       d.FirstName,
			LastName:        d.LastName,
			FullName:        d.FullName(),
			Position:        d.Position,
			ExperienceYears: d.ExperienceYears,
			AvatarPath:      d.AvatarPath,
			Address:         d.Address,
			Phone:           d.Phone,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(list)
}

// PUT /api/v1/users/profile
func (h *UsersHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetCurrentUser(r)
	if user == nil {
		http.Error(w, `{"detail":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req dto.UserProfileUpdate
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"detail":"Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	user.FirstName = req.FirstName
	user.LastName = req.LastName
	user.MiddleName = req.MiddleName
	user.BirthDate = req.BirthDate
	user.Height = req.Height
	user.Weight = req.Weight
	user.City = req.City
	user.ChronicDiseases = req.ChronicDiseases
	user.MedicationAllergies = req.MedicationAllergies
	user.MedicalHistory = req.MedicalHistory

	database.DB.Save(user)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// GET /api/v1/users/patients
func (h *UsersHandler) ListPatients(w http.ResponseWriter, r *http.Request) {
	var patients []models.User
	database.DB.Where("is_doctor = ? AND is_admin = ?", false, false).Find(&patients)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(patients)
}

// GET /api/v1/users/patients/{id}
func (h *UsersHandler) GetPatientDetail(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, `{"detail":"Invalid ID"}`, http.StatusBadRequest)
		return
	}

	var patient models.User
	if err := database.DB.Preload("Tests").Preload("Analyses").First(&patient, id).Error; err != nil {
		http.Error(w, `{"detail":"Patient not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(patient)
}
