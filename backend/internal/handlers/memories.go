package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"esimde-backend/internal/database"
	"esimde-backend/internal/middleware"
	"esimde-backend/internal/models"
	"github.com/go-chi/chi/v5"
)

type MemoriesHandler struct{}

func NewMemoriesHandler() *MemoriesHandler {
	return &MemoriesHandler{}
}

// GET /api/v1/memories
func (h *MemoriesHandler) ListMemories(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetCurrentUser(r)
	if user == nil {
		http.Error(w, `{"detail":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var memories []models.Memory
	database.DB.Where("user_id = ?", user.ID).Find(&memories)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(memories)
}

// POST /api/v1/memories
func (h *MemoriesHandler) CreateMemory(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetCurrentUser(r)
	if user == nil {
		http.Error(w, `{"detail":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var memory models.Memory
	if err := json.NewDecoder(r.Body).Decode(&memory); err != nil {
		http.Error(w, `{"detail":"Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	memory.UserID = user.ID
	database.DB.Create(&memory)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(memory)
}

// DELETE /api/v1/memories/{id}
func (h *MemoriesHandler) DeleteMemory(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetCurrentUser(r)
	if user == nil {
		http.Error(w, `{"detail":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	idStr := chi.URLParam(r, "id")
	id, _ := strconv.Atoi(idStr)

	database.DB.Where("id = ? AND user_id = ?", id, user.ID).Delete(&models.Memory{})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Deleted successfully"})
}
