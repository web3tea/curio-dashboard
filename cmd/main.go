package main

import (
	"fmt"

	"github.com/filecoin-project/curio/build"
	lcli "github.com/filecoin-project/lotus/cli"
	logging "github.com/ipfs/go-log/v2"
	"github.com/urfave/cli/v2"
	"github.com/web3tea/curio-dashboard/version"
)

var log = logging.Logger("cmd")

func main() {
	app := &cli.App{
		Name:                 "curio-dashboard",
		Usage:                "A dashboard for Curio",
		Version:              fmt.Sprintf("%s+curio-%s", version.CurrentCommit, build.BuildVersion),
		EnableBashCompletion: true,
		Flags: []cli.Flag{
			&cli.BoolFlag{
				Name:  "debug",
				Usage: "Enable debug logging",
				Value: false,
			},
			&cli.StringFlag{
				Name:    "config",
				Aliases: []string{"c"},
				Usage:   "Config file to load",
				Value:   "config.toml",
			},
		},
		Before: func(c *cli.Context) error {
			defer func() {
				_ = logging.SetLogLevel("rpc", "ERROR") // nolint: errcheck
			}()
			if c.Bool("debug") {
				return logging.SetLogLevel("*", "DEBUG")
			}
			return logging.SetLogLevel("*", "INFO")
		},
		After: func(*cli.Context) error {
			return nil
		},
		Commands: []*cli.Command{
			runCmd,
			configCmd,
		},
	}
	app.Setup()
	lcli.RunApp(app)
}
