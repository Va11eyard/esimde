package handlers

import (
	"encoding/json"
	"net/http"

	"esimde-backend/internal/dto"
	"esimde-backend/internal/services"
)

type VoiceHandler struct {
	openAISvc *services.OpenAIService
}

func NewVoiceHandler(openAISvc *services.OpenAIService) *VoiceHandler {
	return &VoiceHandler{openAISvc: openAISvc}
}

// POST /api/v1/voice/chat
func (h *VoiceHandler) VoiceChat(w http.ResponseWriter, r *http.Request) {
	var req dto.VoiceChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Message == "" {
		http.Error(w, `{"detail":"Message is required"}`, http.StatusBadRequest)
		return
	}

	reply, err := h.openAISvc.ChatCompletion(r.Context(), req.Message)
	if err != nil {
		http.Error(w, `{"detail":"Failed to get response from AI"}`, http.StatusInternalServerError)
		return
	}

	resp := dto.VoiceChatResponse{
		Reply: reply,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// POST /api/v1/voice/transcribe
func (h *VoiceHandler) TranscribeVoice(w http.ResponseWriter, r *http.Request) {
	resp := map[string]string{
		"text": "Психологқа жазылғым келеді, бірақ мәселемді қалай және неден талқылауды білмеймін",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
