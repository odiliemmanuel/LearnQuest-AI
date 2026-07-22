package student

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"learnquest-backend/internal/database"
	"learnquest-backend/internal/models"
)

func RegisterRoutes(r *gin.RouterGroup) {
	r.GET("/dashboard/summary", summary)
	r.GET("/leaderboard", leaderboard)
}

type subjectProgress struct {
	Subject  string `json:"subject"`
	Attempts int    `json:"attempts"`
	Correct  int    `json:"correct"`
	Progress int    `json:"progress"`
}

type dayActivity struct {
	Day       string `json:"day"`
	Questions int    `json:"questions"`
}

func summary(c *gin.Context) {
	userID := c.MustGet("userId").(uint)

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	var attempts []models.Attempt
	database.DB.Where("user_id = ?", userID).Find(&attempts)

	// Progress per subject
	bySubject := map[string]*subjectProgress{}
	for _, a := range attempts {
		sp, ok := bySubject[a.Subject]
		if !ok {
			sp = &subjectProgress{Subject: a.Subject}
			bySubject[a.Subject] = sp
		}
		sp.Attempts++
		if a.Correct {
			sp.Correct++
		}
	}
	subjects := make([]subjectProgress, 0, len(bySubject))
	for _, sp := range bySubject {
		if sp.Attempts > 0 {
			sp.Progress = (sp.Correct * 100) / sp.Attempts
		}
		subjects = append(subjects, *sp)
	}

	// Last 7 days of activity, Monday first
	days := []string{"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"}
	weekly := make([]dayActivity, 7)
	weekStart := time.Now().AddDate(0, 0, -6)
	counts := map[string]int{}
	for _, a := range attempts {
		if a.CreatedAt.After(weekStart) {
			day := days[int(a.CreatedAt.Weekday()+6)%7]
			counts[day]++
		}
	}
	for i, d := range days {
		weekly[i] = dayActivity{Day: d, Questions: counts[d]}
	}

	c.JSON(http.StatusOK, gin.H{
		"user":     user,
		"subjects": subjects,
		"weekly":   weekly,
	})
}

type leaderboardEntry struct {
	Name   string `json:"name"`
	XP     int    `json:"xp"`
	Streak int    `json:"streak"`
}

func leaderboard(c *gin.Context) {
	var users []models.User
	database.DB.Order("xp desc").Limit(10).Find(&users)

	entries := make([]leaderboardEntry, 0, len(users))
	for _, u := range users {
		entries = append(entries, leaderboardEntry{Name: u.Name, XP: u.XP, Streak: u.Streak})
	}
	c.JSON(http.StatusOK, entries)
}
