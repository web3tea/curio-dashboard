package main

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/strahe/curio-dashboard/config"

	"github.com/filecoin-project/curio/api"
	"github.com/filecoin-project/curio/deps"
	"github.com/filecoin-project/go-address"
	"github.com/filecoin-project/go-jsonrpc"
	"github.com/filecoin-project/lotus/build"
	"github.com/urfave/cli/v2"
)

func getChainAPI(cctx *cli.Context, cfg config.ChainConfig) (api.Chain, jsonrpc.ClientCloser, error) {

	apiInfo := cfg.APIs
	if os.Getenv("FULLNODE_API_INFO") != "" {
		apiInfo = strings.Split(os.Getenv("FULLNODE_API_INFO"), ",")
	}

	return deps.GetFullNodeAPIV1Curio(cctx, apiInfo)
}

func setupNetwork(ctx context.Context, node api.Chain) error {
	// get network name
	ntn, err := node.StateNetworkName(ctx)
	if err != nil {
		return fmt.Errorf("failed to get network name: %w", err)
	}
	log.Infof("Using network: %s", ntn)
	if err := build.UseNetworkBundle(string(ntn)); err != nil {
		return fmt.Errorf("failed to use network bundle: %w", err)
	}
	if ntn == "calibrationnet" {
		address.CurrentNetwork = address.Testnet
	} else if strings.HasPrefix(string(ntn), "localnet") {
		address.CurrentNetwork = address.Testnet
		if err := build.UseNetworkBundle("devnet"); err != nil {
			return fmt.Errorf("failed to use network bundle: %w", err)
		}
	} else {
		address.CurrentNetwork = address.Mainnet
	}
	return nil
}
