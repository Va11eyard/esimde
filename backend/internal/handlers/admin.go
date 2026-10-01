package handlers

import (
	"encoding/json"
	"net/http"

	"esimde-backend/internal/database"
	"esimde-backend/internal/models"
)

type AdminHandler struct{}

func NewAdminHandler() *AdminHandler {
	return &AdminHandler{}
}

// GET /api/v1/admin/audit-logs
func (h *AdminHandler) GetAuditLogs(w http.ResponseWriter, r *http.Request) {
	var logs []models.AuditLog
	database.DB.Preload("User").Order("created_at desc").Limit(100).Find(&logs)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logs)
}
