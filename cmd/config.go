package main

import (
	"fmt"

	cliutil "github.com/filecoin-project/lotus/cli/util"
	"github.com/pelletier/go-toml"
	"github.com/web3tea/curio-dashboard/config"
	"github.com/urfave/cli/v2"
)

var configCmd = &cli.Command{
	Name:  "config",
	Usage: "Manage dashboard config",
	Flags: []cli.Flag{
		cliutil.FlagVeryVerbose,
	},
	Subcommands: []*cli.Command{
		configDefaultCmd,
	},
}

var configDefaultCmd = &cli.Command{
	Name:  "default",
	Usage: "Print the default config",
	Action: func(cctx *cli.Context) error {
		b, err := toml.Marshal(config.DefaultConfig)
		if err != nil {
			return err
		}
		fmt.Println(string(b))
		return nil
	},
}
