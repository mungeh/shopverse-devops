package middleware

import (
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func JWTProtected(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")

	if authHeader == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(
			fiber.Map{
				"message": "Authorization token required",
			},
		)
	}

	parts := strings.Split(authHeader, " ")

	if len(parts) != 2 || parts[0] != "Bearer" {
		return c.Status(fiber.StatusUnauthorized).JSON(
			fiber.Map{
				"message": "Invalid authorization format",
			},
		)
	}

	tokenString := parts[1]

	secret := os.Getenv("JWT_SECRET")

	if secret == "" {
		secret = "shopverse-development-secret"
	}

	token, err := jwt.Parse(
		tokenString,
		func(token *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		},
	)

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(
			fiber.Map{
				"message": "Invalid or expired token",
			},
		)
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(
			fiber.Map{
				"message": "Invalid token claims",
			},
		)
	}

	userID, ok := claims["user_id"].(float64)

	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(
			fiber.Map{
				"message": "Invalid user ID in token",
			},
		)
	}

	c.Locals("user_id", uint(userID))

	return c.Next()
}
