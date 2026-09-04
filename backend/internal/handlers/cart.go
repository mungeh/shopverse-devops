package handlers

import (
	"github.com/gofiber/fiber/v2"

	"shopverse/backend/internal/database"
	"shopverse/backend/internal/models"
)

type AddCartRequest struct {
	ProductID uint `json:"product_id"`
	Quantity  int  `json:"quantity"`
}

type UpdateCartRequest struct {
	Quantity int `json:"quantity"`
}

func GetCart(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	var items []models.CartItem

	err := database.DB.
		Preload("Product").
		Where("user_id = ?", userID).
		Find(&items).
		Error

	if err != nil {
		return c.Status(
			fiber.StatusInternalServerError,
		).JSON(
			fiber.Map{
				"message": "Unable to retrieve cart",
			},
		)
	}

	return c.JSON(
		fiber.Map{
			"items": items,
		},
	)
}

func AddToCart(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	var request AddCartRequest

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"message": "Invalid cart request",
			},
		)
	}

	if request.ProductID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"message": "Product ID is required",
			},
		)
	}

	if request.Quantity <= 0 {
		request.Quantity = 1
	}

	var product models.Product

	if err := database.DB.First(
		&product,
		request.ProductID,
	).Error; err != nil {

		return c.Status(fiber.StatusNotFound).JSON(
			fiber.Map{
				"message": "Product not found",
			},
		)
	}

	if product.Stock < request.Quantity {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"message": "Not enough product stock available",
			},
		)
	}

	var existing models.CartItem

	result := database.DB.Where(
		"user_id = ? AND product_id = ?",
		userID,
		request.ProductID,
	).First(&existing)

	if result.Error == nil {
		newQuantity :=
			existing.Quantity + request.Quantity

		if product.Stock < newQuantity {
			return c.Status(
				fiber.StatusBadRequest,
			).JSON(
				fiber.Map{
					"message": "Requested quantity exceeds available stock",
				},
			)
		}

		existing.Quantity = newQuantity

		if err := database.DB.Save(&existing).Error; err != nil {
			return c.Status(
				fiber.StatusInternalServerError,
			).JSON(
				fiber.Map{
					"message": "Unable to update cart",
				},
			)
		}

		database.DB.Preload("Product").First(
			&existing,
			existing.ID,
		)

		return c.JSON(
			fiber.Map{
				"message": "Cart updated",
				"item":    existing,
			},
		)
	}

	item := models.CartItem{
		UserID:    userID,
		ProductID: request.ProductID,
		Quantity:  request.Quantity,
	}

	if err := database.DB.Create(&item).Error; err != nil {
		return c.Status(
			fiber.StatusInternalServerError,
		).JSON(
			fiber.Map{
				"message": "Unable to add product to cart",
			},
		)
	}

	database.DB.Preload("Product").First(
		&item,
		item.ID,
	)

	return c.Status(fiber.StatusCreated).JSON(
		fiber.Map{
			"message": "Product added to cart",
			"item":    item,
		},
	)
}

func UpdateCart(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	itemID := c.Params("id")

	var request UpdateCartRequest

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"message": "Invalid request",
			},
		)
	}

	if request.Quantity <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"message": "Quantity must be greater than zero",
			},
		)
	}

	var item models.CartItem

	result := database.DB.
		Preload("Product").
		Where(
			"id = ? AND user_id = ?",
			itemID,
			userID,
		).
		First(&item)

	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(
			fiber.Map{
				"message": "Cart item not found",
			},
		)
	}

	if request.Quantity > item.Product.Stock {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"message": "Requested quantity exceeds available stock",
			},
		)
	}

	item.Quantity = request.Quantity

	if err := database.DB.Save(&item).Error; err != nil {
		return c.Status(
			fiber.StatusInternalServerError,
		).JSON(
			fiber.Map{
				"message": "Unable to update cart",
			},
		)
	}

	return c.JSON(
		fiber.Map{
			"message": "Cart updated",
			"item":    item,
		},
	)
}

func RemoveCartItem(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	itemID := c.Params("id")

	result := database.DB.Where(
		"id = ? AND user_id = ?",
		itemID,
		userID,
	).Delete(&models.CartItem{})

	if result.Error != nil {
		return c.Status(
			fiber.StatusInternalServerError,
		).JSON(
			fiber.Map{
				"message": "Unable to remove cart item",
			},
		)
	}

	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(
			fiber.Map{
				"message": "Cart item not found",
			},
		)
	}

	return c.JSON(
		fiber.Map{
			"message": "Item removed from cart",
		},
	)
}
