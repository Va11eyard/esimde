package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type AppointmentStatus string

const (
	StatusPending         AppointmentStatus = "pending"
	StatusAwaitingPayment AppointmentStatus = "awaiting_payment"
	StatusConfirmed       AppointmentStatus = "confirmed"
	StatusCancelled       AppointmentStatus = "cancelled"
	StatusCompleted       AppointmentStatus = "completed"
	StatusNoShow          AppointmentStatus = "no_show"
)

type SlotType string

const (
	SlotOnline  SlotType = "online"
	SlotOffline SlotType = "offline"
	SlotBoth    SlotType = "both"
)

type PaymentStatus string

const (
	PaymentPending  PaymentStatus = "pending"
	PaymentSuccess  PaymentStatus = "success"
	PaymentFailed   PaymentStatus = "failed"
	PaymentRefunded PaymentStatus = "refunded"
)

// User Model
type User struct {
	ID                    uint           `gorm:"primaryKey" json:"id"`
	FirstName             string         `gorm:"size:120" json:"first_name"`
	LastName              string         `gorm:"size:120" json:"last_name"`
	MiddleName            string         `gorm:"size:120" json:"middle_name"`
	Phone                 string         `gorm:"size:20;uniqueIndex" json:"phone"`
	Email                 string         `gorm:"size:255;uniqueIndex" json:"email"`
	Username              string         `gorm:"size:100;uniqueIndex" json:"username"`
	Password              string         `gorm:"size:255" json:"-"`
	Photo                 string         `gorm:"size:500" json:"photo"`
	AvatarPath            string         `gorm:"size:500" json:"avatar_path"`
	BirthDate             *time.Time     `json:"birth_date"`
	Height                string         `gorm:"size:10" json:"height"`
	Weight                string         `gorm:"size:10" json:"weight"`
	Timezone              string         `gorm:"size:50;default:'Asia/Almaty'" json:"timezone"`
	IsDoctor              bool           `gorm:"default:false" json:"is_doctor"`
	IsAdmin               bool           `gorm:"default:false" json:"is_admin"`
	City                  string         `gorm:"size:120" json:"city"`
	ExperienceYears       int            `gorm:"default:0" json:"experience_years"`
	Position              string         `gorm:"size:120" json:"position"`
	Address               string         `gorm:"type:text" json:"address"`
	MedicalHistory        string         `gorm:"type:text" json:"medical_history"`
	ChronicDiseases       string         `gorm:"type:text" json:"chronic_diseases"`
	MedicationAllergies   string         `gorm:"type:text" json:"medication_allergies"`
	PreliminaryConclusion string         `gorm:"type:text" json:"preliminary_conclusion"`
	RememberToken         string         `gorm:"size:100" json:"-"`
	CreatedAt             time.Time      `json:"created_at"`
	UpdatedAt             time.Time      `json:"updated_at"`
	DeletedAt             gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Tests                 []Test               `gorm:"foreignKey:UserID" json:"-"`
	AppointmentsAsPatient []Appointment        `gorm:"foreignKey:PatientID" json:"-"`
	AppointmentsAsDoctor  []Appointment        `gorm:"foreignKey:DoctorID" json:"-"`
	Availabilities        []Availability       `gorm:"foreignKey:DoctorID" json:"-"`
	DoctorAvailabilities  []DoctorAvailability `gorm:"foreignKey:DoctorID" json:"-"`
	Analyses              []Analysis           `gorm:"foreignKey:PatientID" json:"-"`
	Memories              []Memory             `gorm:"foreignKey:UserID" json:"-"`
}

func (u *User) FullName() string {
	full := ""
	if u.LastName != "" {
		full += u.LastName
	}
	if u.FirstName != "" {
		if full != "" {
			full += " "
		}
		full += u.FirstName
	}
	if u.MiddleName != "" {
		if full != "" {
			full += " "
		}
		full += u.MiddleName
	}
	return full
}

// Test Model (Mini-Cog)
type Test struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Hash        uuid.UUID      `gorm:"type:uuid;uniqueIndex;not null" json:"hash"`
	UserID      *uint          `gorm:"index" json:"user_id"`
	Payload     string         `gorm:"type:text" json:"payload"` // JSON encoded string of answers
	CompletedAt *time.Time     `json:"completed_at"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
	User        *User          `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// DoctorAvailability (Weekly Schedule Template)
type DoctorAvailability struct {
	ID                  uint      `gorm:"primaryKey" json:"id"`
	DoctorID            uint      `gorm:"not null;index" json:"doctor_id"`
	DayOfWeek           int       `gorm:"not null" json:"day_of_week"` // 1=Mon..7=Sun
	StartTime           string    `gorm:"size:10;not null" json:"start_time"`
	EndTime             string    `gorm:"size:10;not null" json:"end_time"`
	Type                SlotType  `gorm:"size:20;default:'online'" json:"type"`
	SlotDurationMinutes int       `gorm:"default:60" json:"slot_duration_minutes"`
	Active              bool      `gorm:"default:true" json:"active"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}

// Availability (Specific date slot)
type Availability struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	DoctorID  uint      `gorm:"not null;index" json:"doctor_id"`
	Date      time.Time `gorm:"type:date;not null;index" json:"date"`
	StartTime string    `gorm:"size:10;not null" json:"start_time"`
	EndTime   string    `gorm:"size:10;not null" json:"end_time"`
	Type      SlotType  `gorm:"size:20;not null" json:"type"`
	Available bool      `gorm:"default:true" json:"available"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Appointment Model
type Appointment struct {
	ID        uint              `gorm:"primaryKey" json:"id"`
	PatientID uint              `gorm:"index;not null" json:"patient_id"`
	DoctorID  uint              `gorm:"index;not null" json:"doctor_id"`
	Date      time.Time         `gorm:"type:date" json:"date"`
	StartTime string            `gorm:"size:10" json:"start_time"`
	EndTime   string            `gorm:"size:10" json:"end_time"`
	Type      string            `gorm:"size:20" json:"type"`
	Status    AppointmentStatus `gorm:"size:30;default:'confirmed'" json:"status"`
	CreatedAt time.Time         `json:"created_at"`
	UpdatedAt time.Time         `json:"updated_at"`

	Patient    *User       `gorm:"foreignKey:PatientID" json:"patient,omitempty"`
	Doctor     *User       `gorm:"foreignKey:DoctorID" json:"doctor,omitempty"`
	Conclusion *Conclusion `gorm:"foreignKey:AppointmentID" json:"conclusion,omitempty"`
}

// Conclusion Model
type Conclusion struct {
	ID                         uint      `gorm:"primaryKey" json:"id"`
	AppointmentID              uint      `gorm:"uniqueIndex;not null" json:"appointment_id"`
	PatientID                  uint      `gorm:"index;not null" json:"patient_id"`
	DoctorID                   uint      `gorm:"index;not null" json:"doctor_id"`
	Complaints                 string    `gorm:"type:text" json:"complaints"`
	Diagnosis                  string    `gorm:"type:text" json:"diagnosis"`
	Medications                string    `gorm:"type:text" json:"medications"`
	DietRecommendations        string    `gorm:"type:text" json:"diet_recommendations"`
	ExaminationRecommendations string    `gorm:"type:text" json:"examination_recommendations"`
	CreatedAt                  time.Time `json:"created_at"`
	UpdatedAt                  time.Time `json:"updated_at"`
}

// Analysis Model (Patient file uploads)
type Analysis struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	PatientID   uint      `gorm:"index;not null" json:"patient_id"`
	FilePath    string    `gorm:"size:500;not null" json:"file_path"`
	FileName    string    `gorm:"size:255;not null" json:"file_name"`
	Description string    `gorm:"type:text" json:"description"`
	UploadedAt  time.Time `json:"uploaded_at"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// PreliminaryConclusion Model
type PreliminaryConclusion struct {
	ID                            uint      `gorm:"primaryKey" json:"id"`
	UserID                        uint      `gorm:"index;not null" json:"user_id"`
	TestID                        *uint     `gorm:"index" json:"test_id"`
	ChronicDiseases               string    `gorm:"type:text" json:"chronic_diseases"`
	ChronicDiseasesStructuredJSON string    `gorm:"type:text" json:"chronic_diseases_structured"`
	MedicationAllergies           string    `gorm:"type:text" json:"medication_allergies"`
	MedicationAllergiesStructured string    `gorm:"type:text" json:"medication_allergies_structured"`
	MedicalHistory                string    `gorm:"type:text" json:"medical_history"`
	MedicalHistoryStructuredJSON  string    `gorm:"type:text" json:"medical_history_structured"`
	AISummary                     string    `gorm:"type:text" json:"ai_summary"`
	CreatedAt                     time.Time `json:"created_at"`
	UpdatedAt                     time.Time `json:"updated_at"`
}

// AuditLog Model
type AuditLog struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	UserID        *uint     `gorm:"index" json:"user_id"`
	EventType     string    `gorm:"size:100;index;not null" json:"event_type"`
	AuditableType string    `gorm:"size:100" json:"auditable_type"`
	AuditableID   *uint     `json:"auditable_id"`
	Description   string    `gorm:"type:text" json:"description"`
	OldValuesJSON string    `gorm:"type:text" json:"old_values"`
	NewValuesJSON string    `gorm:"type:text" json:"new_values"`
	IPAddress     string    `gorm:"size:45" json:"ip_address"`
	UserAgent     string    `gorm:"type:text" json:"user_agent"`
	URL           string    `gorm:"size:500" json:"url"`
	CreatedAt     time.Time `gorm:"index" json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`

	User *User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// News Model
type News struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `gorm:"size:255;not null" json:"title"`
	Content     string    `gorm:"type:text;not null" json:"content"`
	ImagePath   string    `gorm:"size:500" json:"image_path"`
	AuthorID    *uint     `json:"author_id"`
	IsPublished bool      `gorm:"default:true" json:"is_published"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	Author *User `gorm:"foreignKey:AuthorID" json:"author,omitempty"`
}

// Memory Model (Memory Diary)
type Memory struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"index;not null" json:"user_id"`
	Title       string    `gorm:"size:200;not null" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	ImagePath   string    `gorm:"size:500" json:"image_path"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Screening is one free online pass: contact, Mini-Cog, and FAQ.
type Screening struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Hash          uuid.UUID `gorm:"type:uuid;uniqueIndex;not null" json:"hash"`
	Creative      string    `gorm:"size:16;index" json:"creative"`
	BuyerName     string    `gorm:"size:120" json:"buyer_name"`
	BuyerPhone    string    `gorm:"size:32" json:"-"`
	BuyerEmail    string    `gorm:"size:255" json:"-"`
	PatientName   string    `gorm:"size:120" json:"patient_name"`
	PatientAge    int       `json:"patient_age"`
	Consent       bool      `json:"consent"`
	MiniCogDone   bool      `json:"minicog_done"`
	WordsRecalled int       `json:"words_recalled"`
	ClockPoints   int       `json:"clock_points"`
	Concern       bool      `json:"concern"`
	MiniCogJSON   string    `gorm:"type:text" json:"-"`
	FaqScore      *int      `json:"faq_score"`
	FaqJSON       string    `gorm:"type:text" json:"-"`
	Status        string    `gorm:"size:20;index" json:"status"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// FunnelEvent counts a step of the screening funnel. It stores no personal data.
type FunnelEvent struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	ScreeningHash string    `gorm:"size:40;index" json:"screening_hash"`
	Creative      string    `gorm:"size:16;index" json:"creative"`
	Name          string    `gorm:"size:40;index" json:"name"`
	CreatedAt     time.Time `gorm:"index" json:"created_at"`
}

// Payment Model (PayLink Integration)
type Payment struct {
	ID                uint          `gorm:"primaryKey" json:"id"`
	AppointmentID     uint          `gorm:"uniqueIndex;not null" json:"appointment_id"`
	UserID            uint          `gorm:"index;not null" json:"user_id"`
	PaylinkOrderID    string        `gorm:"size:200;index" json:"paylink_order_id"`
	PaylinkPaymentURL string        `gorm:"size:500" json:"paylink_payment_url"`
	Amount            int           `gorm:"not null" json:"amount"` // in tiyn (KZT * 100)
	Currency          string        `gorm:"size:10;default:'KZT'" json:"currency"`
	Status            PaymentStatus `gorm:"size:20;default:'pending'" json:"status"`
	CreatedAt         time.Time     `json:"created_at"`
	UpdatedAt         time.Time     `json:"updated_at"`
}
