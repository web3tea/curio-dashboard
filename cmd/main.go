package main

import (
	lcli "github.com/filecoin-project/lotus/cli"
	logging "github.com/ipfs/go-log/v2"
	"github.com/urfave/cli/v2"
)

var log = logging.Logger("cmd")

func main() {
	app := &cli.App{
		Name:                 "curio-dashboard",
		Usage:                "A dashboard for the Curio",
		Version:              "0.0.1", // todo:
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
