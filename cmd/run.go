package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"time"

	"github.com/web3tea/curio-dashboard/graph/prometheus"
	"github.com/web3tea/curio-dashboard/graph/resolvers"

	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/filecoin-project/curio/build"
	cliutil "github.com/filecoin-project/lotus/cli/util"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/web3tea/curio-dashboard/config"
	"github.com/web3tea/curio-dashboard/db"
	"github.com/web3tea/curio-dashboard/graph"
	"github.com/web3tea/curio-dashboard/ui"
	"github.com/urfave/cli/v2"
)

var runCmd = &cli.Command{
	Name:  "run",
	Usage: "run the Curio dashboard server",
	Flags: []cli.Flag{
		cliutil.FlagVeryVerbose,
		&cli.BoolFlag{
			Name:    "ignore-version-mismatch",
			Aliases: []string{"ivm"},
			Usage:   "ignore version mismatch between curio and dashboard build",
			Value:   false,
		},
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

		curioAPI, closer, err := getCurioWebRPCV0(cctx, cfg)
		if err != nil {
			return fmt.Errorf("failed to get curio web rpc: %w", err)
		}
		defer closer()

		curioVersion, err := curioAPI.Version(cctx.Context)
		if err != nil {
			return fmt.Errorf("failed to get curio version: %w", err)
		}

		if !compareVersion(curioVersion, build.BuildVersion) {
			if !cctx.Bool("ignore-version-mismatch") {
				return fmt.Errorf("curio version mismatch: %s != %s, use --ignore-version-mismatch flag to continue anyway", curioVersion, build.BuildVersion)
			}
			fmt.Printf("\n\033[41m\033[33;1m ⚠️  WARNING: CURIO VERSION MISMATCH ⚠️  \033[0m\n")
			fmt.Printf("\033[33;1m Dashboard version: %s | Curio version: %s \033[0m\n", build.BuildVersion, curioVersion)
			fmt.Printf("\033[33;1m The dashboard may not work correctly. Continuing as requested with --ignore-version-mismatch flag. \033[0m\n\n")
		}

		chainAPI, closer, err := getChainAPI(cctx, cfg.Chain, curioVersion, cctx.Bool("ignore-version-mismatch"))
		if err != nil {
			return fmt.Errorf("failed to get chain API: %w", err)
		}
		defer closer()

		if err := setupNetwork(cctx.Context, chainAPI); err != nil {
			return fmt.Errorf("failed to setup network: %w", err)
		}

		e := echo.New()
		e.Use(middleware.CORS())

		e.GET("/playground", playgroundHandler())

		pc, err := prometheus.NewClient(cfg.Features.Metrics.Prometheus)
		if err != nil {
			return fmt.Errorf("failed to create prometheus client: %w", err)
		}

		if err := graph.Router(e, cfg, resolvers.NewResolver(cfg, harmonyDB, chainAPI, curioAPI, pc)); err != nil {
			return fmt.Errorf("failed to setup GraphQL routes: %w", err)
		}

		e.GET("/*", uiHandler())

		ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
		defer stop()
		go func() {
			if err := e.Start(cfg.HTTP.Listen); err != nil && !errors.Is(err, http.ErrServerClosed) {
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

func compareVersion(version1, version2 string) bool {
	v1Parts := strings.Split(version1, ".")
	v2Parts := strings.Split(version2, ".")

	if len(v1Parts) < 2 || len(v2Parts) < 2 {
		return false
	}

	for i := 0; i < 2; i++ {
		num1, err1 := strconv.Atoi(v1Parts[i])
		num2, err2 := strconv.Atoi(v2Parts[i])

		if err1 != nil || err2 != nil {
			return false
		}

		if num1 != num2 {
			return false
		}
	}

	return true
}
