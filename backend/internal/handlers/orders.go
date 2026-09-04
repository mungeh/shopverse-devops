package handlers

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"shopverse/backend/internal/database"
	"shopverse/backend/internal/models"
)

func GetOrders(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	var orders []models.Order

	err := database.DB.
		Preload("Items").
		Preload("Items.Product").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&orders).
		Error

	if err != nil {
		return c.Status(
			fiber.StatusInternalServerError,
		).JSON(
			fiber.Map{
				"message": "Unable to retrieve orders",
			},
		)
	}

	return c.JSON(
		fiber.Map{
			"orders": orders,
		},
	)
}

func CreateOrder(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	var cartItems []models.CartItem

	err := database.DB.
		Preload("Product").
		Where("user_id = ?", userID).
		Find(&cartItems).
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

	if len(cartItems) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"message": "Your cart is empty",
			},
		)
	}

	var createdOrder models.Order

	err = database.DB.Transaction(
		func(tx *gorm.DB) error {
			var total float64

			orderItems := make(
				[]models.OrderItem,
				0,
				len(cartItems),
			)

			for _, cartItem := range cartItems {
				var currentProduct models.Product

				if err := tx.First(
					&currentProduct,
					cartItem.ProductID,
				).Error; err != nil {
					return err
				}

				if currentProduct.Stock < cartItem.Quantity {
					return fiber.NewError(
						fiber.StatusBadRequest,
						"One or more products do not have enough stock",
					)
				}

				lineTotal :=
					currentProduct.Price *
						float64(cartItem.Quantity)

				total += lineTotal

				orderItems = append(
					orderItems,
					models.OrderItem{
						ProductID: currentProduct.ID,
						Quantity:  cartItem.Quantity,
						Price:     currentProduct.Price,
					},
				)
			}

			createdOrder = models.Order{
				UserID: userID,
				Total:  total,
				Status: "Processing",
				Items:  orderItems,
			}

			if err := tx.Create(
				&createdOrder,
			).Error; err != nil {
				return err
			}

			for _, cartItem := range cartItems {
				result := tx.Model(
					&models.Product{},
				).
					Where(
						"id = ? AND stock >= ?",
						cartItem.ProductID,
						cartItem.Quantity,
					).
					Update(
						"stock",
						gorm.Expr(
							"stock - ?",
							cartItem.Quantity,
						),
					)

				if result.Error != nil {
					return result.Error
				}

				if result.RowsAffected == 0 {
					return fiber.NewError(
						fiber.StatusBadRequest,
						"Product stock changed during checkout",
					)
				}
			}

			if err := tx.Where(
				"user_id = ?",
				userID,
			).Delete(
				&models.CartItem{},
			).Error; err != nil {
				return err
			}

			return nil
		},
	)

	if err != nil {
		if fiberError, ok := err.(*fiber.Error); ok {
			return c.Status(
				fiberError.Code,
			).JSON(
				fiber.Map{
					"message": fiberError.Message,
				},
			)
		}

		return c.Status(
			fiber.StatusInternalServerError,
		).JSON(
			fiber.Map{
				"message": "Unable to create order",
			},
		)
	}

	database.DB.
		Preload("Items").
		Preload("Items.Product").
		First(
			&createdOrder,
			createdOrder.ID,
		)

	return c.Status(fiber.StatusCreated).JSON(
		fiber.Map{
			"message": "Order created successfully",
			"order":   createdOrder,
		},
	)
}
