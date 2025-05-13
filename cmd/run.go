package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/web3tea/curio-dashboard/graph/prometheus"
	"github.com/web3tea/curio-dashboard/graph/resolvers"

	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/filecoin-project/curio/build"
	cliutil "github.com/filecoin-project/lotus/cli/util"
	"github.com/urfave/cli/v2"
	"github.com/web3tea/curio-dashboard/config"
	"github.com/web3tea/curio-dashboard/db"
	"github.com/web3tea/curio-dashboard/graph"
	"github.com/web3tea/curio-dashboard/ui"
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

		r := chi.NewRouter()
		r.Use(middleware.Recoverer)
		r.Use(cors.AllowAll().Handler)

		r.Get("/playground", playgroundHandler())

		pc, err := prometheus.NewClient(cfg.Features.Metrics.Prometheus)
		if err != nil {
			return fmt.Errorf("failed to create prometheus client: %w", err)
		}
		graph.Router(r, cfg, resolvers.NewResolver(cfg, harmonyDB, chainAPI, curioAPI, pc))
		r.Handle("/*", uiHandler())

		srv := &http.Server{
			Addr:    cfg.HTTP.Listen,
			Handler: r,
		}

		ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
		defer stop()
		go func() {
			log.Infof("Starting server on %s", cfg.HTTP.Listen)
			if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
				log.Fatalf("listen: %s\n", err)
			}
		}()
		<-ctx.Done()
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := srv.Shutdown(ctx); err != nil {
			log.Fatalf("Server forced to shutdown: %v", err)
		}
		return nil
	},
}

func playgroundHandler() http.HandlerFunc {
	return playground.Handler("GraphQL playground", "/graphql")
}

func uiNotFound(w http.ResponseWriter, r *http.Request) {
	http.Error(w, "404: ui not build", http.StatusNotFound)
}

func uiHandler() http.Handler {
	assets, _ := ui.Assets() // nolint:errcheck
	if assets != nil {
		return http.FileServer(http.FS(assets))
	}
	return http.HandlerFunc(uiNotFound)
}

func compareVersion(version1, version2 string) bool {
	v1Parts := strings.Split(version1, ".")
	v2Parts := strings.Split(version2, ".")

	if len(v1Parts) < 2 || len(v2Parts) < 2 {
		return false
	}

	for i := range 2 {
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
