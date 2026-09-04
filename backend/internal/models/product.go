package models

import "gorm.io/gorm"

type Product struct {
	gorm.Model

	Name        string  `json:"name" gorm:"not null"`
	Description string  `json:"description"`
	Price       float64 `json:"price" gorm:"not null"`
	Image       string  `json:"image"`
	Stock       int     `json:"stock"`
	Category    string  `json:"category"`
}
