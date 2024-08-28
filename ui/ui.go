//go:build dist

package ui

import (
	"embed"
	_ "embed"
	"io/fs"
)

//go:embed all:dist/*
var assets embed.FS

func Assets() (fs.FS, error) {
	return fs.Sub(assets, "dist")
}
