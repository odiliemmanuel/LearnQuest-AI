package theory

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"learnquest-backend/internal/database"
	"learnquest-backend/internal/models"
)

func RegisterRoutes(r *gin.RouterGroup) {
	r.GET("/theory/questions", getQuestions)
	r.POST("/theory/grade", gradeAnswer)
}

type publicTheoryQuestion struct {
	ID     uint   `json:"id"`
	Prompt string `json:"prompt"`
}

func getQuestions(c *gin.Context) {
	subject := c.Query("subject")
	topic := c.Query("topic")

	var questions []models.TheoryQuestion
	query := database.DB.Model(&models.TheoryQuestion{})
	if subject != "" {
		query = query.Where("subject = ?", subject)
	}
	if topic != "" {
		query = query.Where("topic = ?", topic)
	}
	query.Find(&questions)

	result := make([]publicTheoryQuestion, 0, len(questions))
	for _, q := range questions {
		result = append(result, publicTheoryQuestion{ID: q.ID, Prompt: q.Prompt})
	}
	c.JSON(http.StatusOK, result)
}

type gradeRequest struct {
	QuestionID uint   `json:"questionId" binding:"required"`
	Answer     string `json:"answer" binding:"required"`
}

// TODO: this keyword-matching approach is a placeholder so the app works
// end to end today. Replace it with a real call to an AI grading model
// that understands full working (especially for math), not just whether
// certain words appear in the answer.
func gradeAnswer(c *gin.Context) {
	userID := c.MustGet("userId").(uint)

	var req gradeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var question models.TheoryQuestion
	if err := database.DB.First(&question, req.QuestionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "question not found"})
		return
	}

	keyPoints := strings.Split(question.KeyPoints, ",")
	lower := strings.ToLower(req.Answer)
	hits := 0
	var missing []string
	for _, k := range keyPoints {
		if strings.Contains(lower, strings.ToLower(strings.TrimSpace(k))) {
			hits++
		} else {
			missing = append(missing, strings.TrimSpace(k))
		}
	}
	ratio := float64(hits) / float64(len(keyPoints))

	verdict := "incorrect"
	feedback := "You're missing the key working here — a strong answer should mention: " + strings.Join(keyPoints, ", ") + "."
	xp := 0

	if ratio >= 0.75 {
		verdict = "correct"
		feedback = "Well explained — your working and conclusion both check out."
		xp = 15
	} else if ratio >= 0.4 {
		verdict = "partial"
		feedback = "You're on the right track, but you're missing: " + strings.Join(missing, ", ") + "."
		xp = 5
	}

	attempt := models.Attempt{
		UserID: userID, Type: "theory", Subject: question.Subject, Topic: question.Topic,
		QuestionID: question.ID, Correct: verdict == "correct", XPEarned: xp,
	}
	database.DB.Create(&attempt)

	if xp > 0 {
		var user models.User
		if err := database.DB.First(&user, userID).Error; err == nil {
			user.XP += xp
			database.DB.Save(&user)
		}
	}

	c.JSON(http.StatusOK, gin.H{"verdict": verdict, "feedback": feedback, "xpEarned": xp})
}
