package handlers

import (
	"encoding/json"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"

	"esimde-backend/internal/config"
	"esimde-backend/internal/database"
	"esimde-backend/internal/models"
	"esimde-backend/internal/services"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type ScreeningHandler struct {
	cfg *config.Config
}

func NewScreeningHandler(cfg *config.Config) *ScreeningHandler {
	return &ScreeningHandler{cfg: cfg}
}

type screeningCreateRequest struct {
	Creative    string `json:"creative"`
	BuyerName   string `json:"buyer_name"`
	BuyerPhone  string `json:"buyer_phone"`
	BuyerEmail  string `json:"buyer_email"`
	PatientName string `json:"patient_name"`
	PatientAge  int    `json:"patient_age"`
	Consent     bool   `json:"consent"`
}

type miniCogRequest struct {
	Recalled    []string               `json:"recalled"`
	Numbers     []services.ClockNumber `json:"numbers"`
	HourAngle   float64                `json:"hour_angle"`
	MinuteAngle float64                `json:"minute_angle"`
}

type faqRequest struct {
	Answers []int `json:"answers"`
}

type funnelRequest struct {
	Event         string `json:"event"`
	Creative      string `json:"creative"`
	ScreeningHash string `json:"screening_hash"`
}

type screeningView struct {
	Hash        string                 `json:"hash"`
	Creative    string                 `json:"creative"`
	PatientName string                 `json:"patient_name"`
	PatientAge  int                    `json:"patient_age"`
	BuyerName   string                 `json:"buyer_name"`
	Status      string                 `json:"status"`
	MiniCog     *services.MiniCogScore `json:"minicog,omitempty"`
	FAQ         *faqView               `json:"faq,omitempty"`
	Disclaimer  string                 `json:"disclaimer"`
	ShareURL    string                 `json:"share_url"`
	PDFURL      string                 `json:"pdf_url"`
	WhatsAppURL string                 `json:"whatsapp_url"`
}

type faqView struct {
	Score   int    `json:"score"`
	Summary string `json:"summary"`
}

var clientEvents = map[string]bool{
	"landing_view":   true,
	"cta_click":      true,
	"test_started":   true,
	"report_viewed":  true,
	"whatsapp_click": true,
}

func (h *ScreeningHandler) Create(w http.ResponseWriter, r *http.Request) {
	if !dbReady(w) {
		return
	}
	var req screeningCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeDetail(w, http.StatusBadRequest, "Не удалось прочитать форму")
		return
	}
	req.BuyerName = strings.TrimSpace(req.BuyerName)
	req.PatientName = strings.TrimSpace(req.PatientName)
	req.BuyerPhone = strings.TrimSpace(req.BuyerPhone)
	req.BuyerEmail = strings.TrimSpace(req.BuyerEmail)
	if req.BuyerName == "" || req.PatientName == "" || req.BuyerPhone == "" {
		writeDetail(w, http.StatusBadRequest, "Укажите имя родителя, ваше имя и телефон")
		return
	}
	if req.PatientAge < 1 || req.PatientAge > 120 {
		writeDetail(w, http.StatusBadRequest, "Укажите возраст родителя")
		return
	}
	if req.BuyerEmail != "" && !strings.Contains(req.BuyerEmail, "@") {
		writeDetail(w, http.StatusBadRequest, "Проверьте email")
		return
	}
	if !req.Consent {
		writeDetail(w, http.StatusBadRequest, "Нужно согласие на обработку данных")
		return
	}

	screening := models.Screening{
		Hash:        uuid.New(),
		Creative:    cleanCreative(req.Creative),
		BuyerName:   req.BuyerName,
		BuyerPhone:  req.BuyerPhone,
		BuyerEmail:  req.BuyerEmail,
		PatientName: req.PatientName,
		PatientAge:  req.PatientAge,
		Consent:     true,
		Status:      "contact",
	}
	if err := database.DB.Create(&screening).Error; err != nil {
		writeDetail(w, http.StatusInternalServerError, "Не удалось сохранить анкету")
		return
	}
	h.track(screening.Hash.String(), screening.Creative, "contact_saved")
	writeJSON(w, http.StatusCreated, h.view(&screening))
}

func (h *ScreeningHandler) SaveMiniCog(w http.ResponseWriter, r *http.Request) {
	screening, ok := h.load(w, r)
	if !ok {
		return
	}
	var req miniCogRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeDetail(w, http.StatusBadRequest, "Не удалось прочитать тест")
		return
	}
	score := services.ScoreMiniCog(services.MiniCogInput{
		Recalled:    req.Recalled,
		Numbers:     req.Numbers,
		HourAngle:   req.HourAngle,
		MinuteAngle: req.MinuteAngle,
	})
	raw, _ := json.Marshal(req)
	screening.MiniCogDone = true
	screening.WordsRecalled = score.WordsRecalled
	screening.ClockPoints = score.ClockPoints
	screening.Concern = score.Concern
	screening.MiniCogJSON = string(raw)
	screening.Status = "minicog"
	if err := database.DB.Save(screening).Error; err != nil {
		writeDetail(w, http.StatusInternalServerError, "Не удалось сохранить тест")
		return
	}
	h.track(screening.Hash.String(), screening.Creative, "test_finished")
	writeJSON(w, http.StatusOK, h.view(screening))
}

func (h *ScreeningHandler) SaveFAQ(w http.ResponseWriter, r *http.Request) {
	screening, ok := h.load(w, r)
	if !ok {
		return
	}
	if !screening.MiniCogDone {
		writeDetail(w, http.StatusBadRequest, "Сначала завершите Mini-Cog")
		return
	}
	var req faqRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeDetail(w, http.StatusBadRequest, "Не удалось прочитать опрос")
		return
	}
	sum, _, err := services.ScoreFAQ(req.Answers)
	if err != nil {
		writeDetail(w, http.StatusBadRequest, "Ответьте на все 10 вопросов")
		return
	}
	raw, _ := json.Marshal(req.Answers)
	screening.FaqScore = &sum
	screening.FaqJSON = string(raw)
	screening.Status = "report"
	if err := database.DB.Save(screening).Error; err != nil {
		writeDetail(w, http.StatusInternalServerError, "Не удалось сохранить опрос")
		return
	}
	h.track(screening.Hash.String(), screening.Creative, "faq_finished")
	writeJSON(w, http.StatusOK, h.view(screening))
}

func (h *ScreeningHandler) Get(w http.ResponseWriter, r *http.Request) {
	screening, ok := h.load(w, r)
	if !ok {
		return
	}
	writeJSON(w, http.StatusOK, h.view(screening))
}

func (h *ScreeningHandler) PDF(w http.ResponseWriter, r *http.Request) {
	screening, ok := h.load(w, r)
	if !ok {
		return
	}
	bytes, err := services.GenerateScreeningPDF(screening, h.shareURL(screening.Hash.String()))
	if err != nil {
		writeDetail(w, http.StatusInternalServerError, "Не удалось собрать PDF")
		return
	}
	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", "attachment; filename=esimde-report.pdf")
	w.Write(bytes)
}

func (h *ScreeningHandler) Track(w http.ResponseWriter, r *http.Request) {
	if !dbReady(w) {
		return
	}
	var req funnelRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeDetail(w, http.StatusBadRequest, "Не удалось прочитать событие")
		return
	}
	if !clientEvents[req.Event] {
		writeDetail(w, http.StatusBadRequest, "Неизвестное событие")
		return
	}
	h.track(req.ScreeningHash, cleanCreative(req.Creative), req.Event)
	writeJSON(w, http.StatusCreated, map[string]string{"status": "ok"})
}

func (h *ScreeningHandler) Summary(w http.ResponseWriter, r *http.Request) {
	if !dbReady(w) {
		return
	}
	var rows []struct {
		Name     string
		Creative string
		Count    int64
	}
	database.DB.Model(&models.FunnelEvent{}).
		Select("name, creative, count(*) as count").
		Group("name, creative").
		Scan(&rows)
	writeJSON(w, http.StatusOK, map[string]any{"events": rows})
}

func (h *ScreeningHandler) load(w http.ResponseWriter, r *http.Request) (*models.Screening, bool) {
	if !dbReady(w) {
		return nil, false
	}
	parsed, err := uuid.Parse(chi.URLParam(r, "hash"))
	if err != nil {
		writeDetail(w, http.StatusBadRequest, "Некорректная ссылка")
		return nil, false
	}
	var screening models.Screening
	if err := database.DB.Where("hash = ?", parsed).First(&screening).Error; err != nil {
		writeDetail(w, http.StatusNotFound, "Отчёт не найден")
		return nil, false
	}
	return &screening, true
}

func (h *ScreeningHandler) view(screening *models.Screening) screeningView {
	hash := screening.Hash.String()
	view := screeningView{
		Hash:        hash,
		Creative:    screening.Creative,
		PatientName: screening.PatientName,
		PatientAge:  screening.PatientAge,
		BuyerName:   screening.BuyerName,
		Status:      screening.Status,
		Disclaimer:  services.Disclaimer,
		ShareURL:    h.shareURL(hash),
		PDFURL:      strings.TrimRight(h.cfg.PublicAppURL, "/") + "/api/v1/screenings/" + hash + "/pdf",
		WhatsAppURL: whatsAppLink(h.cfg.WhatsAppPhone, "Здравствуйте! Мы прошли бесплатный онлайн-скрининг памяти на Esimde и хотим записаться на приём. Отчёт: "+h.shareURL(hash)),
	}
	if screening.MiniCogDone {
		summary := "По правилам Mini-Cog результат отрицательный: по этому короткому тесту явных признаков не видно. Это не диагноз. За памятью всё равно стоит следить."
		if screening.Concern {
			summary = "По правилам Mini-Cog результат положительный: есть повод обсудить память со специалистом. Это не диагноз."
		}
		view.MiniCog = &services.MiniCogScore{
			WordsRecalled: screening.WordsRecalled,
			ClockPoints:   screening.ClockPoints,
			NumbersOK:     screening.ClockPoints == 2,
			HandsOK:       screening.ClockPoints == 2,
			Concern:       screening.Concern,
			Summary:       summary,
		}
	}
	if screening.FaqScore != nil {
		view.FAQ = &faqView{Score: *screening.FaqScore, Summary: services.FAQSummary(*screening.FaqScore)}
	}
	return view
}

func (h *ScreeningHandler) shareURL(hash string) string {
	return strings.TrimRight(h.cfg.PublicAppURL, "/") + "/#report/" + hash
}

func (h *ScreeningHandler) track(hash, creative, name string) {
	if database.DB == nil {
		return
	}
	database.DB.Create(&models.FunnelEvent{
		ScreeningHash: hash,
		Creative:      cleanCreative(creative),
		Name:          name,
		CreatedAt:     time.Now(),
	})
}

func cleanCreative(value string) string {
	switch value {
	case "a", "b", "c":
		return value
	default:
		return "default"
	}
}

func whatsAppLink(phone, text string) string {
	digits := regexp.MustCompile(`\D`).ReplaceAllString(phone, "")
	escaped := url.QueryEscape(text)
	if digits == "" {
		return "https://api.whatsapp.com/send?text=" + escaped
	}
	return "https://wa.me/" + digits + "?text=" + escaped
}

func dbReady(w http.ResponseWriter) bool {
	if database.DB == nil {
		writeDetail(w, http.StatusServiceUnavailable, "База данных недоступна")
		return false
	}
	return true
}

func writeDetail(w http.ResponseWriter, status int, detail string) {
	writeJSON(w, status, map[string]string{"detail": detail})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}
