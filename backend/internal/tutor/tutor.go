package tutor

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup) {
	r.POST("/tutor/chat", chat)
}

type chatRequest struct {
	Message string `json:"message" binding:"required"`
	Subject string `json:"subject"`
	Topic   string `json:"topic"`
}

// TODO: replace this rule-based reply with a real call to an LLM (OpenAI,
// Anthropic, or your own model). Pass req.Subject, req.Topic, and the
// student's ClassLevel (fetch the User by c.MustGet("userId")) into the
// prompt so the tutor stays on-topic and explains at the right level —
// exactly the "small AI model that adapts to class level" from your plan.
func chat(c *gin.Context) {
	var req chatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	topic := req.Topic
	if topic == "" {
		topic = "this topic"
	}

	lower := strings.ToLower(req.Message)
	var reply string

	switch {
	case strings.Contains(lower, "simpl"):
		reply = fmt.Sprintf("Here's the simplest way to think about %s: focus on what changes and what stays fixed, then work out how one affects the other. Want a worked example?", topic)
	case strings.Contains(lower, "wrong") || strings.Contains(lower, "why"):
		reply = "Let's check your working step by step — which line did you write first, and what formula did you use?"
	case strings.Contains(lower, "example"):
		reply = fmt.Sprintf("Sure — here's another %s question in the same style as the ones you just practiced. Want me to generate it now?", topic)
	case strings.Contains(lower, "waec") || strings.Contains(lower, "neco"):
		reply = fmt.Sprintf("For WAEC/NECO, %s questions usually test the formula and one calculation. Make sure you can state the formula, substitute correctly, and show your units.", topic)
	default:
		reply = fmt.Sprintf("Good question about %s. Can you tell me specifically what part is confusing you — the concept, the formula, or a calculation?", topic)
	}

	c.JSON(http.StatusOK, gin.H{"reply": reply})
}
