package models

import "gorm.io/gorm"

type CartItem struct {
	gorm.Model

	UserID    uint `json:"user_id" gorm:"not null"`
	ProductID uint `json:"product_id" gorm:"not null"`
	Quantity  int  `json:"quantity" gorm:"not null;default:1"`

	Product Product `json:"product" gorm:"foreignKey:ProductID"`
}
