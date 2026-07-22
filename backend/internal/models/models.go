package models

import "time"

// User represents both students and teachers. Role distinguishes them.
type User struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Name         string    `json:"name"`
	Email        string    `gorm:"uniqueIndex" json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `gorm:"default:student" json:"role"` // "student" | "teacher"
	ClassLevel   string    `json:"classLevel"`
	Verified     bool      `gorm:"default:false" json:"verified"`
	OTPCode      string    `json:"-"`
	OTPExpiresAt time.Time `json:"-"`
	XP           int       `gorm:"default:0" json:"xp"`
	Streak       int       `gorm:"default:0" json:"streak"`
	LastActiveAt time.Time `json:"lastActiveAt"`
	CreatedAt    time.Time `json:"createdAt"`
}

// Question is a multiple-choice practice question.
// Correct and the feedback text are never sent to the client directly —
// they're only used server-side when grading an answer.
type Question struct {
	ID              uint   `gorm:"primaryKey" json:"id"`
	Subject         string `json:"subject"`
	Topic           string `json:"topic"`
	ClassLevel      string `json:"classLevel"`
	Text            string `json:"text"`
	OptionA         string `json:"optionA"`
	OptionB         string `json:"optionB"`
	OptionC         string `json:"optionC"`
	OptionD         string `json:"optionD"`
	Correct         string `json:"-"`
	FeedbackCorrect string `json:"-"`
	FeedbackWrong   string `json:"-"`
}

// TheoryQuestion is a typed-answer question. KeyPoints is a comma-separated
// list of terms a full-mark answer should contain — used as a placeholder
// grader until a real AI grading model is wired in.
type TheoryQuestion struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Subject   string `json:"subject"`
	Topic     string `json:"topic"`
	Prompt    string `json:"prompt"`
	KeyPoints string `json:"-"`
}

// Attempt records every answer a student submits, for both MCQ and theory
// questions. This is what powers XP, progress, and the teacher dashboard.
type Attempt struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserID     uint      `json:"userId"`
	Type       string    `json:"type"` // "mcq" | "theory"
	Subject    string    `json:"subject"`
	Topic      string    `json:"topic"`
	QuestionID uint      `json:"questionId"`
	Correct    bool      `json:"correct"`
	XPEarned   int       `json:"xpEarned"`
	CreatedAt  time.Time `json:"createdAt"`
}

// LibraryNote is a condensed, original study note for one subject/topic —
// written specifically for LearnQuest, not copied from any existing book,
// the same way a study-guide app writes its own summaries of a text rather
// than reproducing it. Read entirely inside the app; nothing here links out.
// Populated two ways: a handful seeded on first run (see database.go), and
// ongoing additions from scripts/textbook_fetcher, which asks Gemini to
// write one for any topic that doesn't have notes yet.
type LibraryNote struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Subject   string    `gorm:"uniqueIndex:idx_subject_topic" json:"subject"`
	Topic     string    `gorm:"uniqueIndex:idx_subject_topic" json:"topic"`
	Title     string    `json:"title"`
	Content   string    `json:"content"` // full study note text, shown in-app
	CreatedAt time.Time `json:"createdAt"`
}
