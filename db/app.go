package db

import (
	"fmt"

	"github.com/xo/dburl"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func NewAppDb(dbURL string) (*gorm.DB, error) {
	u, err := dburl.Parse(dbURL)
	if err != nil {
		return nil, err
	}

	var dialect gorm.Dialector
	switch u.Driver {
	case "sqlite3":
		dialect = sqlite.Open(u.DSN)
	case "postgres", "postgresql":
		dialect = postgres.Open(u.DSN)
	default:
		return nil, fmt.Errorf("unsupported database driver: %s", u.Driver)
	}

	db, err := gorm.Open(dialect, &gorm.Config{})
	if err != nil {
		return nil, err
	}
	err = db.AutoMigrate(
		&User{},
	)

	return db, err
}

type User struct {
	gorm.Model
	Username    string
	Password    string
	Description string
}
