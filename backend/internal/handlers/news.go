package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"esimde-backend/internal/database"
	"esimde-backend/internal/models"
	"github.com/go-chi/chi/v5"
)

type NewsHandler struct{}

func NewNewsHandler() *NewsHandler {
	return &NewsHandler{}
}

// GET /api/v1/news
func (h *NewsHandler) ListNews(w http.ResponseWriter, r *http.Request) {
	var newsList []models.News
	database.DB.Where("is_published = ?", true).Order("created_at desc").Find(&newsList)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newsList)
}

// POST /api/v1/news
func (h *NewsHandler) CreateNews(w http.ResponseWriter, r *http.Request) {
	var item models.News
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		http.Error(w, `{"detail":"Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	database.DB.Create(&item)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

// DELETE /api/v1/news/{id}
func (h *NewsHandler) DeleteNews(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, _ := strconv.Atoi(idStr)

	database.DB.Delete(&models.News{}, id)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "News item deleted"})
}
