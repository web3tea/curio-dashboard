package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/prometheus/client_golang/api"

	"github.com/strahe/curio-dashboard/graph/resolvers"

	"github.com/99designs/gqlgen/graphql/playground"
	cliutil "github.com/filecoin-project/lotus/cli/util"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/strahe/curio-dashboard/config"
	"github.com/strahe/curio-dashboard/db"
	"github.com/strahe/curio-dashboard/graph"
	"github.com/strahe/curio-dashboard/ui"
	"github.com/urfave/cli/v2"
)

var runCmd = &cli.Command{
	Name:  "run",
	Usage: "run the Curio dashboard server",
	Flags: []cli.Flag{
		cliutil.FlagVeryVerbose,
	},
	Action: func(cctx *cli.Context) error {
		cfg, err := config.NewFromFile(cctx.String("config"))
		if err != nil {
			return fmt.Errorf("failed to load config: %w", err)
		}

		harmonyDB, err := db.NewHarmonyDB(cctx.Context, cfg.HarmonyDB)
		if err != nil {
			return fmt.Errorf("failed to connect to harmonydb: %w", err)
		}
		defer harmonyDB.Close()

		chainAPI, closer, err := getChainAPI(cctx, cfg.Chain)
		if err != nil {
			return fmt.Errorf("failed to get chain API: %w", err)
		}
		defer closer()

		curioAPI, closer, err := getCurioWebRpcV0(cctx, cfg)
		if err != nil {
			return fmt.Errorf("failed to get curio web rpc: %w", err)
		}
		defer closer()

		if err := setupNetwork(cctx.Context, chainAPI); err != nil {
			return fmt.Errorf("failed to setup network: %w", err)
		}

		e := echo.New()
		e.Use(middleware.CORS())

		e.GET("/playground", playgroundHandler())

		client, err := api.NewClient(api.Config{
			Address: cfg.Features.Metrics.Prometheus,
		})
		if err != nil {
			return fmt.Errorf("failed to create Prometheus client: %s", err)
		}
		if err := graph.Router(e, cfg, resolvers.NewResolver(harmonyDB, chainAPI, curioAPI, client)); err != nil {
			return fmt.Errorf("failed to setup GraphQL routes: %w", err)
		}

		e.GET("/*", uiHandler())

		ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
		defer stop()
		go func() {
			if err := e.Start(cfg.Http.Listen); err != nil && !errors.Is(err, http.ErrServerClosed) {
				e.Logger.Fatalf("shutting down the server: %s", err)
			}
		}()
		<-ctx.Done()
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := e.Shutdown(ctx); err != nil {
			e.Logger.Fatal(err)
		}
		return nil
	},
}

func playgroundHandler() echo.HandlerFunc {
	h := playground.Handler("GraphQL playground", "/graphql")
	return echo.WrapHandler(h)
}

func uiHandler() echo.HandlerFunc {
	assets, _ := ui.Assets() // nolint:errcheck
	if assets != nil {
		fs := http.FileServer(http.FS(assets))
		return echo.WrapHandler(http.StripPrefix("/", fs))
	}
	return func(c echo.Context) error {
		return c.String(http.StatusNotFound, "UI assets not found")
	}
}
