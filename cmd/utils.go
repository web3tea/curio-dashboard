package main

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/filecoin-project/curio/api"
	"github.com/filecoin-project/curio/deps"
	"github.com/filecoin-project/go-address"
	"github.com/filecoin-project/go-jsonrpc"
	lapi "github.com/filecoin-project/lotus/api"
	"github.com/filecoin-project/lotus/build"
	cliutil "github.com/filecoin-project/lotus/cli/util"
	"github.com/strahe/curio-dashboard/config"
	"github.com/strahe/curio-dashboard/graph/curiorpc"
	"github.com/urfave/cli/v2"
	"golang.org/x/xerrors"
)

func getChainAPI(cctx *cli.Context, cfg config.ChainConfig, curioVersion string, ignoreVersionMismatch bool) (api.Chain, jsonrpc.ClientCloser, error) {
	apiInfo := cfg.APIs
	if os.Getenv("FULLNODE_API_INFO") != "" {
		apiInfo = strings.Split(os.Getenv("FULLNODE_API_INFO"), ",")
	}

	return GetFullNodeAPIV1Curio(cctx, apiInfo, curioVersion, ignoreVersionMismatch)
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

type httpHead struct {
	addr   string
	header http.Header
}

func GetFullNodeAPIV1Curio(ctx *cli.Context, ainfoCfg []string, curioVersion string, ignoreVersionMismatch bool) (api.Chain, jsonrpc.ClientCloser, error) {
	if len(ainfoCfg) == 0 {
		return nil, nil, xerrors.Errorf("no full node API endpoints provided")
	}

	var httpHeads []httpHead
	version := "v1"
	for _, i := range ainfoCfg {
		ainfo := cliutil.ParseApiInfo(i)
		addr, err := ainfo.DialArgs(version)
		if err != nil {
			return nil, nil, xerrors.Errorf("could not get DialArgs: %w", err)
		}
		httpHeads = append(httpHeads, httpHead{addr: addr, header: ainfo.AuthHeader()})
	}

	if cliutil.IsVeryVerbose {
		_, _ = fmt.Fprintln(ctx.App.Writer, "using full node API v1 endpoint:", httpHeads[0].addr)
	}

	var fullNodes []api.Chain
	var closers []jsonrpc.ClientCloser

	// Check network compatibility for each node
	for _, head := range httpHeads {
		v1api, closer, err := newChainNodeRPCV1(ctx.Context, head.addr, head.header)
		if err != nil {
			log.Warnf("Not able to establish connection to node with addr: %s, Reason: %s", head.addr, err.Error())
			continue
		}

		// Validate network match
		networkName, err := v1api.StateNetworkName(ctx.Context)
		if err != nil {
			log.Warnf("Failed to get network name from node %s: %s", head.addr, err.Error())
			closer()
			continue
		}

		if networkName == "calibrationnet" {
			networkName = "calibnet"
		}

		sp := strings.SplitN(curioVersion, "+", 3)
		if len(sp) == 3 {
			// version + build + commit
			if sp[1] != string(networkName) && !ignoreVersionMismatch {
				log.Warnf("Network mismatch for node %s: curio built for %s but node is on %s",
					head.addr, curioVersion, networkName)
				closer()
				continue
			}
		}

		fullNodes = append(fullNodes, v1api)
		closers = append(closers, closer)
	}

	if len(fullNodes) == 0 {
		return nil, nil, xerrors.Errorf("failed to establish connection with all nodes")
	}

	finalCloser := func() {
		for _, c := range closers {
			c()
		}
	}

	var v1API api.ChainStruct
	deps.FullNodeProxy(fullNodes, &v1API)

	return &v1API, finalCloser, nil
}

func newChainNodeRPCV1(ctx context.Context, addr string, requestHeader http.Header, opts ...jsonrpc.Option) (api.Chain, jsonrpc.ClientCloser, error) {
	var res api.ChainStruct
	closer, err := jsonrpc.NewMergeClient(ctx, addr, "Filecoin",
		api.GetInternalStructs(&res), requestHeader, append([]jsonrpc.Option{jsonrpc.WithErrors(lapi.RPCErrors)}, opts...)...)

	return &res, closer, err
}
