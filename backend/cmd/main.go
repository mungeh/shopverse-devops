package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"shopverse/backend/internal/database"
	"shopverse/backend/internal/handlers"
	"shopverse/backend/internal/middleware"
)

func main() {
	database.Connect()

	app := fiber.New(
		fiber.Config{
			AppName: "ShopVerse API",
		},
	)

	app.Use(recover.New())

	app.Use(logger.New())

	app.Use(
		cors.New(
			cors.Config{
				AllowOrigins: "http://localhost:5173,http://localhost:3000",

				AllowHeaders: "Origin, Content-Type, Accept, Authorization",

				AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
			},
		),
	)

	app.Get(
		"/health",
		func(c *fiber.Ctx) error {
			return c.JSON(
				fiber.Map{
					"status":  "healthy",
					"service": "shopverse-api",
				},
			)
		},
	)

	api := app.Group("/api")

	auth := api.Group("/auth")

	auth.Post(
		"/register",
		handlers.Register,
	)

	auth.Post(
		"/login",
		handlers.Login,
	)

	api.Get(
		"/products",
		handlers.GetProducts,
	)

	api.Get(
		"/products/:id",
		handlers.GetProduct,
	)

	protected := api.Group(
		"",
		middleware.JWTProtected,
	)

	protected.Post(
		"/products",
		handlers.CreateProduct,
	)

	protected.Get(
		"/cart",
		handlers.GetCart,
	)

	protected.Post(
		"/cart",
		handlers.AddToCart,
	)

	protected.Put(
		"/cart/:id",
		handlers.UpdateCart,
	)

	protected.Delete(
		"/cart/:id",
		handlers.RemoveCartItem,
	)

	protected.Get(
		"/orders",
		handlers.GetOrders,
	)

	protected.Post(
		"/orders",
		handlers.CreateOrder,
	)

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	log.Printf(
		"ShopVerse API running on port %s",
		port,
	)

	log.Fatal(
		app.Listen(":" + port),
	)
}
