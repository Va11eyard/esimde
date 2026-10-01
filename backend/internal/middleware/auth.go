package middleware

import (
	"context"
	"net/http"
	"strings"

	"esimde-backend/internal/config"
	"esimde-backend/internal/database"
	"esimde-backend/internal/models"
	"esimde-backend/internal/utils"
)

type contextKey string

const UserContextKey contextKey = "currentUser"

func AuthMiddleware(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				next.ServeHTTP(w, r)
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				next.ServeHTTP(w, r)
				return
			}

			tokenStr := parts[1]
			claims, err := utils.ParseJWT(tokenStr, cfg.JWTSecret)
			if err != nil {
				next.ServeHTTP(w, r)
				return
			}

			var user models.User
			if err := database.DB.First(&user, claims.UserID).Error; err != nil {
				next.ServeHTTP(w, r)
				return
			}

			ctx := context.WithValue(r.Context(), UserContextKey, &user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func GetCurrentUser(r *http.Request) *models.User {
	user, ok := r.Context().Value(UserContextKey).(*models.User)
	if !ok {
		return nil
	}
	return user
}

func RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := GetCurrentUser(r)
		if user == nil {
			http.Error(w, `{"detail":"Unauthorized access"}`, http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func RequireDoctor(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := GetCurrentUser(r)
		if user == nil || (!user.IsDoctor && !user.IsAdmin) {
			http.Error(w, `{"detail":"Doctor access required"}`, http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func RequireAdmin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := GetCurrentUser(r)
		if user == nil || !user.IsAdmin {
			http.Error(w, `{"detail":"Admin access required"}`, http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}
