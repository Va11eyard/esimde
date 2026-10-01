package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"esimde-backend/internal/database"
	"esimde-backend/internal/dto"
	"esimde-backend/internal/middleware"
	"esimde-backend/internal/models"
	"esimde-backend/internal/services"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type TestsHandler struct{}

func NewTestsHandler() *TestsHandler {
	return &TestsHandler{}
}

// POST /api/v1/tests
func (h *TestsHandler) CreateOrUpdateTest(w http.ResponseWriter, r *http.Request) {
	var req dto.TestAnswerRequest
	_ = json.NewDecoder(r.Body).Decode(&req)

	user := middleware.GetCurrentUser(r)

	newHash := uuid.New()
	test := models.Test{
		Hash:        newHash,
		CompletedAt: func() *time.Time { t := time.Now(); return &t }(),
	}

	if user != nil {
		test.UserID = &user.ID
	}

	payloadMap := map[string]interface{}{
		"answer": req.Answer,
		"point":  req.Point,
	}
	payloadBytes, _ := json.Marshal(payloadMap)
	test.Payload = string(payloadBytes)

	database.DB.Create(&test)

	resp := dto.TestResponse{
		ID:                  test.ID,
		Hash:                test.Hash.String(),
		UserID:              test.UserID,
		Payload:             test.Payload,
		Points:              req.Point,
		NeurocognitiveScore: req.Point * 20.0,
		CompletedAt:         test.CompletedAt,
		CreatedAt:           test.CreatedAt,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// GET /api/v1/tests/{hash}
func (h *TestsHandler) GetTestByHash(w http.ResponseWriter, r *http.Request) {
	hashStr := chi.URLParam(r, "hash")
	parsedUUID, err := uuid.Parse(hashStr)
	if err != nil {
		http.Error(w, `{"detail":"Invalid Hash UUID"}`, http.StatusBadRequest)
		return
	}

	var test models.Test
	if err := database.DB.Preload("User").Where("hash = ?", parsedUUID).First(&test).Error; err != nil {
		http.Error(w, `{"detail":"Test not found"}`, http.StatusNotFound)
		return
	}

	resp := dto.TestResponse{
		ID:                  test.ID,
		Hash:                test.Hash.String(),
		UserID:              test.UserID,
		Payload:             test.Payload,
		Points:              3.0,
		NeurocognitiveScore: 85.0,
		CompletedAt:         test.CompletedAt,
		CreatedAt:           test.CreatedAt,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// GET /api/v1/tests/{hash}/pdf
func (h *TestsHandler) DownloadPDFReport(w http.ResponseWriter, r *http.Request) {
	hashStr := chi.URLParam(r, "hash")
	parsedUUID, err := uuid.Parse(hashStr)
	if err != nil {
		http.Error(w, `{"detail":"Invalid Hash UUID"}`, http.StatusBadRequest)
		return
	}

	var test models.Test
	if err := database.DB.Preload("User").Where("hash = ?", parsedUUID).First(&test).Error; err != nil {
		http.Error(w, `{"detail":"Test not found"}`, http.StatusNotFound)
		return
	}

	pdfBytes, err := services.GenerateTestPDFReport(&test)
	if err != nil {
		http.Error(w, `{"detail":"PDF generation error"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", "attachment; filename=esimde_report_"+hashStr+".pdf")
	w.Write(pdfBytes)
}
