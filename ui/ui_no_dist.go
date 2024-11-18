//go:build !dist

package ui

import (
	"fmt"
	"io/fs"
)

func Assets() (fs.FS, error) {
	return nil, fmt.Errorf("dist directory does not exist")
}
