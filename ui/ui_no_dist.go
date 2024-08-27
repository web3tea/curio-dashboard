//go:build !dist

package ui

import (
	"errors"
	"io/fs"
)

func Assets() (fs.FS, error) {
	return nil, errors.New("dist directory does not exist")
}
