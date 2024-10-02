package resolvers

import (
	"time"

	"github.com/filecoin-project/lotus/api/v1api"
	logging "github.com/ipfs/go-log/v2"
	"github.com/prometheus/client_golang/api"
	v1 "github.com/prometheus/client_golang/api/prometheus/v1"
	"github.com/strahe/curio-dashboard/config"
	"github.com/strahe/curio-dashboard/db"
	"github.com/strahe/curio-dashboard/graph/curiorpc"
	"github.com/strahe/curio-dashboard/graph/loaders"
	"github.com/strahe/curio-dashboard/graph/prometheus"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

const sectorDefaultCacheAge = time.Minute * 5

var log = logging.Logger("resolvers")

type Resolver struct {
	cfg              *config.Config
	db               *db.HarmonyDB
	fullNode         v1api.FullNode
	loader           *loaders.Loader
	prometheusAPI    v1.API
	curioAPI         curiorpc.WebRPC
	prometheusClient *prometheus.Client
}

func NewResolver(cfg *config.Config, db *db.HarmonyDB, fullNode v1api.FullNode, curioAPI curiorpc.WebRPC, client api.Client) *Resolver {
	papi := v1.NewAPI(client)
	return &Resolver{
		cfg:              cfg,
		db:               db,
		fullNode:         fullNode,
		loader:           loaders.NewLoader(db, 1000),
		prometheusAPI:    papi,
		prometheusClient: prometheus.NewClient(papi),
		curioAPI:         curioAPI,
	}
}
