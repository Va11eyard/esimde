package database

import (
	"esimde-backend/internal/config"
	"esimde-backend/internal/models"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB(cfg *config.Config) *gorm.DB {
	db, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Printf("PostgreSQL connection error (%v). Running with dummy DB connection or local Postgres...", err)
		// For development without PostgreSQL running locally, GORM can handle connection attempts
	} else {
		log.Println("Database connection established successfully.")

		// Auto Migrate Schema
		err = db.AutoMigrate(
			&models.User{},
			&models.Test{},
			&models.DoctorAvailability{},
			&models.Availability{},
			&models.Appointment{},
			&models.Conclusion{},
			&models.Analysis{},
			&models.PreliminaryConclusion{},
			&models.AuditLog{},
			&models.News{},
			&models.Memory{},
			&models.Payment{},
			&models.Screening{},
			&models.FunnelEvent{},
		)
		if err != nil {
			log.Printf("Warning: Failed to auto-migrate database schema: %v", err)
		} else {
			log.Println("Database migration completed.")
		}
	}

	DB = db
	return db
}
