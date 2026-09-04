package models

import "gorm.io/gorm"

type User struct {
	gorm.Model

	Name     string `json:"name" gorm:"size:150;not null"`
	Email    string `json:"email" gorm:"size:191;uniqueIndex;not null"`
	Password string `json:"-" gorm:"size:255;not null"`
	Role     string `json:"role" gorm:"size:50;default:user"`
}
