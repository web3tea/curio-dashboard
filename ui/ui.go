//go:build dist

package ui

import (
	"embed"
	_ "embed"
	"fmt"
	"io/fs"
	"os"
)

//go:embed dist/*
var assets embed.FS

func Assets() (fs.FS, error) {
	if _, err := os.Stat("dist"); os.IsNotExist(err) {
		return nil, fmt.Errorf("dist directory does not exist")
	}
	return fs.Sub(assets, "dist")
}
