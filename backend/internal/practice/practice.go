package practice

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"learnquest-backend/internal/database"
	"learnquest-backend/internal/models"
)

func RegisterRoutes(r *gin.RouterGroup) {
	r.GET("/practice/questions", getQuestions)
	r.POST("/practice/submit", submitAnswer)
}

// publicQuestion omits the answer key and feedback text — those only get
// sent back after the student submits an answer.
type publicQuestion struct {
	ID      uint   `json:"id"`
	Text    string `json:"text"`
	OptionA string `json:"optionA"`
	OptionB string `json:"optionB"`
	OptionC string `json:"optionC"`
	OptionD string `json:"optionD"`
}

func getQuestions(c *gin.Context) {
	subject := c.Query("subject")
	topic := c.Query("topic")

	var questions []models.Question
	query := database.DB.Model(&models.Question{})
	if subject != "" {
		query = query.Where("subject = ?", subject)
	}
	if topic != "" {
		query = query.Where("topic = ?", topic)
	}
	query.Find(&questions)

	result := make([]publicQuestion, 0, len(questions))
	for _, q := range questions {
		result = append(result, publicQuestion{
			ID: q.ID, Text: q.Text,
			OptionA: q.OptionA, OptionB: q.OptionB, OptionC: q.OptionC, OptionD: q.OptionD,
		})
	}

	c.JSON(http.StatusOK, result)
}

type submitRequest struct {
	QuestionID uint   `json:"questionId" binding:"required"`
	Answer     string `json:"answer" binding:"required"`
}

// TODO: this is where you'd call your AI model to generate a feedback
// explanation scaled to the student's class level, instead of returning
// the question's fixed feedback text. The question's Subject/Topic and
// the student's ClassLevel (on the User record) give you what you need.
func submitAnswer(c *gin.Context) {
	userID := c.MustGet("userId").(uint)

	var req submitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var question models.Question
	if err := database.DB.First(&question, req.QuestionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "question not found"})
		return
	}

	correct := req.Answer == question.Correct
	feedback := question.FeedbackWrong
	xp := 0
	if correct {
		feedback = question.FeedbackCorrect
		xp = 10
	}

	attempt := models.Attempt{
		UserID: userID, Type: "mcq", Subject: question.Subject, Topic: question.Topic,
		QuestionID: question.ID, Correct: correct, XPEarned: xp,
	}
	database.DB.Create(&attempt)

	if xp > 0 {
		var user models.User
		if err := database.DB.First(&user, userID).Error; err == nil {
			user.XP += xp
			database.DB.Save(&user)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"correct":  correct,
		"feedback": feedback,
		"xpEarned": xp,
	})
}
