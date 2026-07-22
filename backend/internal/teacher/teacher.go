package teacher

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"learnquest-backend/internal/database"
	"learnquest-backend/internal/models"
)

func RegisterRoutes(r *gin.RouterGroup) {
	r.GET("/teacher/students", students)
}

type studentSummary struct {
	ID         uint     `json:"id"`
	Name       string   `json:"name"`
	ClassLevel string   `json:"classLevel"`
	AvgScore   int      `json:"avgScore"`
	WeakTopics []string `json:"weakTopics"`
}

type topicStats struct {
	total   int
	correct int
}

// TODO: restrict this to users with role == "teacher" once you have real
// teacher accounts — right now any authenticated user can call it. Check
// c.MustGet("role") and return 403 if it isn't "teacher".
func students(c *gin.Context) {
	var users []models.User
	database.DB.Where("role = ?", "student").Find(&users)

	result := make([]studentSummary, 0, len(users))
	for _, u := range users {
		var attempts []models.Attempt
		database.DB.Where("user_id = ?", u.ID).Find(&attempts)

		correct := 0
		byTopic := map[string]topicStats{}
		for _, a := range attempts {
			t := byTopic[a.Topic]
			t.total++
			if a.Correct {
				t.correct++
				correct++
			}
			byTopic[a.Topic] = t
		}

		avg := 0
		if len(attempts) > 0 {
			avg = (correct * 100) / len(attempts)
		}

		var weak []string
		for topic, stats := range byTopic {
			if stats.total > 0 && (stats.correct*100)/stats.total < 60 {
				weak = append(weak, topic)
			}
		}

		result = append(result, studentSummary{
			ID: u.ID, Name: u.Name, ClassLevel: u.ClassLevel, AvgScore: avg, WeakTopics: weak,
		})
	}

	c.JSON(http.StatusOK, result)
}
