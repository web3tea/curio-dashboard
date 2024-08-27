package main

import (
	"fmt"
	"math/rand"
	"os"
	"time"

	"github.com/xo/dburl"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	u, _ := dburl.Parse(os.Getenv("CURIO_APPDB_URL")) // nolint: errcheck
	db, err := gorm.Open(postgres.Open(u.DSN), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	startTime := time.Now().AddDate(0, 0, -7)
	endTime := time.Now()

	storageIDs := []string{"storage1", "storage2"}

	// Initial values
	available := int64(500 * 1024 * 1024 * 1024)
	fsAvailable := int64(500 * 1024 * 1024 * 1024)
	reserved := int64(100 * 1024 * 1024 * 1024)
	used := int64(400 * 1024 * 1024 * 1024)

	for t := startTime; t.Before(endTime); t = t.Add(time.Hour) {
		for _, storageID := range storageIDs {
			// Generate small random changes
			availableChange := rand.Int63n(10) * 1024 * 1024 * 1024
			fsAvailableChange := rand.Int63n(10) * 1024 * 1024 * 1024
			reservedChange := rand.Int63n(10) * 1024 * 1024 * 1024
			usedChange := rand.Int63n(10) * 1024 * 1024 * 1024

			// Apply changes
			available += availableChange
			fsAvailable += fsAvailableChange
			reserved += reservedChange
			used += usedChange

			// Insert into database
			sql := `INSERT INTO storage_usages (time, storage_id, available, fs_available, reserved, used) VALUES (?, ?, ?, ?, ?, ?)`
			db.Exec(sql, t, storageID, available, fsAvailable, reserved, used)
		}
	}

	fmt.Println("Data generation complete.")
}
