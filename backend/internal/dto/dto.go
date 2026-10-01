package dto

import "time"

// Auth DTOs
type OTPSendRequest struct {
	Phone string `json:"phone"`
	Email string `json:"email"`
}

type OTPSendResponse struct {
	Message string `json:"message"`
	DevCode string `json:"dev_code,omitempty"`
}

type OTPVerifyRequest struct {
	Phone string `json:"phone"`
	Email string `json:"email"`
	Code  string `json:"code"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type UserShort struct {
	ID                    uint    `json:"id"`
	FirstName             string  `json:"first_name"`
	LastName              string  `json:"last_name"`
	MiddleName            string  `json:"middle_name"`
	Email                 string  `json:"email"`
	Phone                 string  `json:"phone"`
	IsDoctor              bool    `json:"is_doctor"`
	IsAdmin               bool    `json:"is_admin"`
	AvatarPath            string  `json:"avatar_path"`
	PreliminaryConclusion string  `json:"preliminary_conclusion"`
	Age                   *int    `json:"age,omitempty"`
	Height                string  `json:"height"`
	Weight                string  `json:"weight"`
}

type TokenResponse struct {
	AccessToken     string     `json:"access_token"`
	TokenType       string     `json:"token_type"`
	UserID          uint       `json:"user_id"`
	IsDoctor        bool       `json:"is_doctor"`
	IsAdmin         bool       `json:"is_admin"`
	ProfileComplete bool       `json:"profile_complete"`
	User            *UserShort `json:"user,omitempty"`
}

// User Profile DTOs
type UserProfileUpdate struct {
	FirstName           string     `json:"first_name"`
	LastName            string     `json:"last_name"`
	MiddleName          string     `json:"middle_name"`
	BirthDate           *time.Time `json:"birth_date"`
	Height              string     `json:"height"`
	Weight              string     `json:"weight"`
	Phone               string     `json:"phone"`
	City                string     `json:"city"`
	ChronicDiseases     string     `json:"chronic_diseases"`
	MedicationAllergies string     `json:"medication_allergies"`
	MedicalHistory      string     `json:"medical_history"`
}

type DoctorProfileUpdate struct {
	FirstName       string     `json:"first_name"`
	LastName        string     `json:"last_name"`
	MiddleName      string     `json:"middle_name"`
	Phone           string     `json:"phone"`
	BirthDate       *time.Time `json:"birth_date"`
	City            string     `json:"city"`
	ExperienceYears int        `json:"experience_years"`
	Position        string     `json:"position"`
	Address         string     `json:"address"`
}

type DoctorListItem struct {
	ID              uint   `json:"id"`
	FirstName       string `json:"first_name"`
	LastName        string `json:"last_name"`
	FullName        string `json:"full_name"`
	Position        string `json:"position"`
	ExperienceYears int    `json:"experience_years"`
	AvatarPath      string `json:"avatar_path"`
	Address         string `json:"address"`
	Phone           string `json:"phone"`
}

// Test DTOs (Mini-Cog)
type TestAnswerRequest struct {
	CurrentQuestion int     `json:"current_question"`
	Answer          string  `json:"answer"`
	Point           float64 `json:"point"`
	NextQuestion    int     `json:"next_question"`
	Email           string  `json:"email"`
	Phone           string  `json:"phone"`
	FirstName       string  `json:"first_name"`
	LastName        string  `json:"last_name"`
	MiddleName      string  `json:"middle_name"`
}

type TestResponse struct {
	ID                  uint      `json:"id"`
	Hash                string    `json:"hash"`
	UserID              *uint     `json:"user_id"`
	Payload             string    `json:"payload"`
	Points              float64   `json:"points"`
	NeurocognitiveScore float64   `json:"neurocognitive_score"`
	CompletedAt         *time.Time `json:"completed_at"`
	CreatedAt           time.Time `json:"created_at"`
}

// Appointment & Schedule DTOs
type AppointmentCreateRequest struct {
	SlotID uint `json:"slot_id"`
}

type ConclusionUpdateRequest struct {
	Complaints                 string `json:"complaints"`
	Diagnosis                  string `json:"diagnosis"`
	Medications                string `json:"medications"`
	DietRecommendations        string `json:"diet_recommendations"`
	ExaminationRecommendations string `json:"examination_recommendations"`
}

// Voice Assistant DTOs
type VoiceChatRequest struct {
	Message string `json:"message"`
}

type VoiceChatResponse struct {
	Reply string `json:"reply"`
}

// Payment DTOs
type PaymentCreateRequest struct {
	AppointmentID uint `json:"appointment_id"`
}
