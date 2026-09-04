package handlers

import (
	"github.com/gofiber/fiber/v2"

	"shopverse/backend/internal/database"
	"shopverse/backend/internal/models"
)

func GetProducts(c *fiber.Ctx) error {
	var products []models.Product

	if err := database.DB.Find(&products).Error; err != nil {
		return c.Status(
			fiber.StatusInternalServerError,
		).JSON(
			fiber.Map{
				"message": "Unable to retrieve products",
			},
		)
	}

	return c.JSON(
		fiber.Map{
			"products": products,
		},
	)
}

func GetProduct(c *fiber.Ctx) error {
	id := c.Params("id")

	var product models.Product

	result := database.DB.First(
		&product,
		id,
	)

	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(
			fiber.Map{
				"message": "Product not found",
			},
		)
	}

	return c.JSON(
		fiber.Map{
			"product": product,
		},
	)
}

func CreateProduct(c *fiber.Ctx) error {
	var product models.Product

	if err := c.BodyParser(&product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"message": "Invalid product information",
			},
		)
	}

	if product.Name == "" || product.Price <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"message": "Product name and valid price are required",
			},
		)
	}

	if err := database.DB.Create(&product).Error; err != nil {
		return c.Status(
			fiber.StatusInternalServerError,
		).JSON(
			fiber.Map{
				"message": "Unable to create product",
			},
		)
	}

	return c.Status(fiber.StatusCreated).JSON(
		fiber.Map{
			"message": "Product created",
			"product": product,
		},
	)
}
