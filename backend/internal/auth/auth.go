package auth

import (
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"learnquest-backend/internal/database"
	"learnquest-backend/internal/models"
)

var jwtSecret string

func RegisterRoutes(r *gin.RouterGroup, secret string) {
	jwtSecret = secret
	r.POST("/auth/signup", signup)
	r.POST("/auth/verify-otp", verifyOTP)
	r.POST("/auth/resend-otp", resendOTP)
	r.POST("/auth/login", login)
}

func generateOTP() string {
	return fmt.Sprintf("%06d", rand.Intn(1000000))
}

func generateToken(userID uint, role string) (string, error) {
	claims := jwt.MapClaims{
		"userId": userID,
		"role":   role,
		"exp":    time.Now().Add(7 * 24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}

type signupRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

func signup(c *gin.Context) {
	var req signupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existing models.User
	if err := database.DB.Where("email = ?", req.Email).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "an account with this email already exists"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not process password"})
		return
	}

	otp := generateOTP()

	user := models.User{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: string(hash),
		Role:         "student",
		ClassLevel:   "SS2",
		Verified:     false,
		OTPCode:      otp,
		OTPExpiresAt: time.Now().Add(10 * time.Minute),
		LastActiveAt: time.Now(),
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create account"})
		return
	}

	// NOTE: no email/SMS service is wired up yet, so the OTP is returned
	// directly here for local testing. Before shipping this for real:
	// send it through an email provider instead, and remove devOtp below.
	c.JSON(http.StatusCreated, gin.H{
		"message": "account created — verify with the code sent to your email",
		"email":   user.Email,
		"devOtp":  otp,
	})
}

type verifyOTPRequest struct {
	Email string `json:"email" binding:"required,email"`
	Code  string `json:"code" binding:"required"`
}

func verifyOTP(c *gin.Context) {
	var req verifyOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no account found for this email"})
		return
	}

	if time.Now().After(user.OTPExpiresAt) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code expired — request a new one"})
		return
	}

	if user.OTPCode != req.Code {
		c.JSON(http.StatusBadRequest, gin.H{"error": "incorrect code"})
		return
	}

	user.Verified = true
	user.OTPCode = ""
	database.DB.Save(&user)

	token, err := generateToken(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate session"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "user": user})
}

type resendOTPRequest struct {
	Email string `json:"email" binding:"required,email"`
}

func resendOTP(c *gin.Context) {
	var req resendOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no account found for this email"})
		return
	}

	otp := generateOTP()
	user.OTPCode = otp
	user.OTPExpiresAt = time.Now().Add(10 * time.Minute)
	database.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{"message": "a new code has been sent", "devOtp": otp})
}

type loginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "incorrect email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "incorrect email or password"})
		return
	}

	if !user.Verified {
		c.JSON(http.StatusForbidden, gin.H{"error": "please verify your email first", "email": user.Email})
		return
	}

	user.LastActiveAt = time.Now()
	database.DB.Save(&user)

	token, err := generateToken(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate session"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "user": user})
}
