package handlers

import (
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"shopverse/backend/internal/database"
	"shopverse/backend/internal/models"
)

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(c *fiber.Ctx) error {
	var request RegisterRequest

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"message": "Invalid request body",
			},
		)
	}

	request.Name = strings.TrimSpace(request.Name)
	request.Email = strings.ToLower(
		strings.TrimSpace(request.Email),
	)

	if request.Name == "" ||
		request.Email == "" ||
		request.Password == "" {

		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"message": "Name, email and password are required",
			},
		)
	}

	if len(request.Password) < 6 {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"message": "Password must be at least 6 characters",
			},
		)
	}

	var existingUser models.User

	result := database.DB.Where(
		"email = ?",
		request.Email,
	).First(&existingUser)

	if result.Error == nil {
		return c.Status(fiber.StatusConflict).JSON(
			fiber.Map{
				"message": "An account with this email already exists",
			},
		)
	}

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(request.Password),
		bcrypt.DefaultCost,
	)

	if err != nil {
		return c.Status(
			fiber.StatusInternalServerError,
		).JSON(
			fiber.Map{
				"message": "Unable to secure password",
			},
		)
	}

	user := models.User{
		Name:     request.Name,
		Email:    request.Email,
		Password: string(hashedPassword),
		Role:     "user",
	}

	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(
			fiber.StatusInternalServerError,
		).JSON(
			fiber.Map{
				"message": "Unable to create account",
			},
		)
	}

	return c.Status(fiber.StatusCreated).JSON(
		fiber.Map{
			"message": "Registration successful",
			"user": fiber.Map{
				"id":    user.ID,
				"name":  user.Name,
				"email": user.Email,
				"role":  user.Role,
			},
		},
	)
}

func Login(c *fiber.Ctx) error {
	var request LoginRequest

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"message": "Invalid request body",
			},
		)
	}

	request.Email = strings.ToLower(
		strings.TrimSpace(request.Email),
	)

	var user models.User

	result := database.DB.Where(
		"email = ?",
		request.Email,
	).First(&user)

	if result.Error != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(
			fiber.Map{
				"message": "Invalid email or password",
			},
		)
	}

	err := bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(request.Password),
	)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(
			fiber.Map{
				"message": "Invalid email or password",
			},
		)
	}

	secret := os.Getenv("JWT_SECRET")

	if secret == "" {
		secret = "shopverse-development-secret"
	}

	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp": time.Now().
			Add(24 * time.Hour).
			Unix(),
	}

	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		claims,
	)

	signedToken, err := token.SignedString(
		[]byte(secret),
	)

	if err != nil {
		return c.Status(
			fiber.StatusInternalServerError,
		).JSON(
			fiber.Map{
				"message": "Unable to create login token",
			},
		)
	}

	return c.JSON(
		fiber.Map{
			"message": "Login successful",

			"token": signedToken,

			"user": fiber.Map{
				"id":    user.ID,
				"name":  user.Name,
				"email": user.Email,
				"role":  user.Role,
			},
		},
	)
}
