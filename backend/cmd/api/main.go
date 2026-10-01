package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"esimde-backend/internal/config"
	"esimde-backend/internal/database"
	"esimde-backend/internal/handlers"
	"esimde-backend/internal/middleware"
	"esimde-backend/internal/services"

	_ "esimde-backend/docs" // Swagger generated docs

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	httpSwagger "github.com/swaggo/http-swagger/v2"
)

func main() {
	// 1. Load Config
	cfg := config.LoadConfig()

	// 2. Init Database & AutoMigrate
	database.InitDB(cfg)

	// 3. Init Services
	openAISvc := services.NewOpenAIService(cfg)

	// 4. Init Handlers
	authH := handlers.NewAuthHandler(cfg)
	usersH := handlers.NewUsersHandler()
	testsH := handlers.NewTestsHandler()
	schedH := handlers.NewScheduleHandler()
	appH := handlers.NewAppointmentsHandler()
	memH := handlers.NewMemoriesHandler()
	newsH := handlers.NewNewsHandler()
	voiceH := handlers.NewVoiceHandler(openAISvc)
	payH := handlers.NewPaymentsHandler()
	adminH := handlers.NewAdminHandler()
	screenH := handlers.NewScreeningHandler(cfg)

	// 5. Setup Chi Router
	r := chi.NewRouter()

	// Basic Middlewares
	r.Use(chiMiddleware.Logger)
	r.Use(chiMiddleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Use(middleware.AuthMiddleware(cfg))

	// Health Check
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok","service":"esimde-backend-go","version":"1.0.0"}`))
	})

	// Swagger UI Route
	r.Get("/swagger/*", httpSwagger.WrapHandler)
	r.Get("/swagger", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/swagger/index.html", http.StatusMovedPermanently)
	})

	// API v1 Routes
	r.Route("/api/v1", func(r chi.Router) {
		// Auth
		r.Post("/auth/send-otp", authH.SendOTP)
		r.Post("/auth/verify-otp", authH.VerifyOTP)
		r.Post("/auth/login", authH.Login)
		r.With(middleware.RequireAuth).Get("/auth/me", authH.Me)

		// Users
		r.Get("/users/doctors", usersH.ListDoctors)
		r.With(middleware.RequireAuth).Put("/users/profile", usersH.UpdateProfile)
		r.With(middleware.RequireDoctor).Get("/users/patients", usersH.ListPatients)
		r.With(middleware.RequireDoctor).Get("/users/patients/{id}", usersH.GetPatientDetail)

		// Free screening funnel
		r.Post("/screenings", screenH.Create)
		r.Post("/screenings/{hash}/minicog", screenH.SaveMiniCog)
		r.Post("/screenings/{hash}/faq", screenH.SaveFAQ)
		r.Get("/screenings/{hash}", screenH.Get)
		r.Get("/screenings/{hash}/pdf", screenH.PDF)
		r.Post("/funnel", screenH.Track)
		r.Get("/funnel/summary", screenH.Summary)

		// Tests (Mini-Cog)
		r.Post("/tests", testsH.CreateOrUpdateTest)
		r.Get("/tests/{hash}", testsH.GetTestByHash)
		r.Get("/tests/{hash}/pdf", testsH.DownloadPDFReport)

		// Schedule
		r.Get("/schedule/availability", schedH.GetAvailability)
		r.With(middleware.RequireDoctor).Post("/schedule/availability", schedH.CreateAvailability)

		// Appointments
		r.With(middleware.RequireAuth).Post("/appointments", appH.CreateAppointment)
		r.With(middleware.RequireAuth).Get("/appointments", appH.ListAppointments)
		r.With(middleware.RequireDoctor).Post("/appointments/{id}/conclusion", appH.AddConclusion)

		// Memories (Memory Diary)
		r.With(middleware.RequireAuth).Get("/memories", memH.ListMemories)
		r.With(middleware.RequireAuth).Post("/memories", memH.CreateMemory)
		r.With(middleware.RequireAuth).Delete("/memories/{id}", memH.DeleteMemory)

		// News
		r.Get("/news", newsH.ListNews)
		r.With(middleware.RequireAdmin).Post("/news", newsH.CreateNews)
		r.With(middleware.RequireAdmin).Delete("/news/{id}", newsH.DeleteNews)

		// Voice AI Assistant
		r.Post("/voice/chat", voiceH.VoiceChat)
		r.Post("/voice/transcribe", voiceH.TranscribeVoice)

		// Payments
		r.With(middleware.RequireAuth).Post("/payments/create", payH.CreatePayment)
		r.Get("/payments/status/{id}", payH.GetPaymentStatus)

		// Admin Audit
		r.With(middleware.RequireAdmin).Get("/admin/audit-logs", adminH.GetAuditLogs)
	})

	// Server execution
	addr := ":" + cfg.Port
	log.Printf("Starting Esimde Go Backend server on port %s (Swagger UI at http://localhost:%s/swagger/)...", cfg.Port, cfg.Port)

	srv := &http.Server{
		Addr:         addr,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	// Graceful shutdown handling
	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	<-done
	log.Println("Server stopping cleanly...")
}
