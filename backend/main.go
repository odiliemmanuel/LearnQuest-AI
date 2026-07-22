package main

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"learnquest-backend/internal/auth"
	"learnquest-backend/internal/curriculum"
	"learnquest-backend/internal/database"
	"learnquest-backend/internal/middleware"
	"learnquest-backend/internal/practice"
	"learnquest-backend/internal/student"
	"learnquest-backend/internal/teacher"
	"learnquest-backend/internal/theory"
	"learnquest-backend/internal/tutor"
)

func main() {
	database.Connect()

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "dev-secret-change-me-before-production"
		log.Println("JWT_SECRET not set — using an insecure default. Fine for local dev, not for deploying.")
	}

	frontendURL := os.Getenv("FRONTEND_URL")

	ingestSecret := os.Getenv("INGEST_SECRET")
	if ingestSecret == "" {
		ingestSecret = "dev-ingest-secret-change-me"
		log.Println("INGEST_SECRET not set — using an insecure default. Fine for local dev only.")
	}

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		// Vite bumps to 5174, 5175, etc. if 5173 is already taken by a
		// leftover process from an earlier session — a fixed single origin
		// here means every restart is a potential CORS break. Instead:
		// accept any localhost/127.0.0.1 port for local dev, and also
		// honor FRONTEND_URL explicitly if it's set to something else
		// (a real deployed domain, for instance).
		AllowOriginFunc: func(origin string) bool {
			if frontendURL != "" && origin == frontendURL {
				return true
			}
			return strings.HasPrefix(origin, "http://localhost:") ||
				strings.HasPrefix(origin, "http://127.0.0.1:")
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	api := r.Group("/api")

	// Public routes
	auth.RegisterRoutes(api, jwtSecret)
	curriculum.RegisterRoutes(api, ingestSecret)

	// Everything below requires a valid Bearer token
	protected := api.Group("")
	protected.Use(middleware.AuthRequired(jwtSecret))
	practice.RegisterRoutes(protected)
	theory.RegisterRoutes(protected)
	tutor.RegisterRoutes(protected)
	student.RegisterRoutes(protected)
	teacher.RegisterRoutes(protected)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("LearnQuest backend running on http://localhost:%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
