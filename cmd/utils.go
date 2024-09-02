package main

import (
	"context"
	"fmt"
	"net/url"
	"os"
	"strings"

	"github.com/filecoin-project/curio/api"
	"github.com/filecoin-project/curio/deps"
	"github.com/filecoin-project/go-address"
	"github.com/filecoin-project/go-jsonrpc"
	"github.com/filecoin-project/lotus/build"
	"github.com/strahe/curio-dashboard/config"
	"github.com/strahe/curio-dashboard/graph/curiorpc"
	"github.com/urfave/cli/v2"
)

func getChainAPI(cctx *cli.Context, cfg config.ChainConfig) (api.Chain, jsonrpc.ClientCloser, error) {

	apiInfo := cfg.APIs
	if os.Getenv("FULLNODE_API_INFO") != "" {
		apiInfo = strings.Split(os.Getenv("FULLNODE_API_INFO"), ",")
	}

	return deps.GetFullNodeAPIV1Curio(cctx, apiInfo)
}

func getCurioWebRPCV0(ctx *cli.Context, cfg *config.Config) (curiorpc.WebRPC, jsonrpc.ClientCloser, error) {
	var webRPCs []curiorpc.WebRPC
	var closers []jsonrpc.ClientCloser

	for _, endpoint := range cfg.Curio.APIs {

		u, err := url.Parse(endpoint)
		if err != nil {
			log.Errorf("Failed to parse curio api endpoint: %s, Reason: %s", endpoint, err.Error())
			continue
		}
		var rpcAddr string
		switch u.Scheme {
		case "http", "ws":
			rpcAddr = fmt.Sprintf("ws://%s/api/webrpc/v0", u.Host)
		case "https", "wss":
			rpcAddr = fmt.Sprintf("wss://%s/api/webrpc/v0", u.Host)
		default:
			log.Errorf("Invalid scheme for curio api endpoint: %s", endpoint)
			continue
		}

		wRPC, closer, err := curiorpc.NewWebRPCV0(ctx.Context, rpcAddr, nil)
		if err != nil {
			log.Errorf("Not able to establish connection to curio with addr: %s, Reason: %s", rpcAddr, err.Error())
			continue
		}
		webRPCs = append(webRPCs, wRPC)
		closers = append(closers, closer)
	}

	if len(webRPCs) < 1 {
		return nil, nil, fmt.Errorf("no curio nodes available")
	}

	finalCloser := func() {
		for _, c := range closers {
			c()
		}
	}

	var webRPC curiorpc.WebRPCStruct
	curiorpc.WebRPCProxy(webRPCs, &webRPC)

	return &webRPC, finalCloser, nil
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
