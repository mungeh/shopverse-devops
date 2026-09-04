package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"shopverse/backend/internal/models"
)

var DB *gorm.DB

func Connect() {
	host := getEnv("DB_HOST", "127.0.0.1")
	port := getEnv("DB_PORT", "3306")
	user := getEnv("DB_USER", "shopverse")
	password := getEnv("DB_PASSWORD", "shopverse123")
	name := getEnv("DB_NAME", "shopverse")

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user,
		password,
		host,
		port,
		name,
	)

	var err error

	for attempt := 1; attempt <= 10; attempt++ {
		DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

		if err == nil {
			log.Println("Connected to MySQL database")
			break
		}

		log.Printf(
			"Database connection attempt %d failed: %v",
			attempt,
			err,
		)

		time.Sleep(3 * time.Second)
	}

	if err != nil {
		log.Fatal("Could not connect to MySQL:", err)
	}

	err = DB.AutoMigrate(
		&models.User{},
		&models.Product{},
		&models.CartItem{},
		&models.Order{},
		&models.OrderItem{},
	)

	if err != nil {
		log.Fatal("Database migration failed:", err)
	}

	log.Println("Database migration completed")
}

func getEnv(key string, fallback string) string {
	value := os.Getenv(key)

	if value == "" {
		return fallback
	}

	return value
}
