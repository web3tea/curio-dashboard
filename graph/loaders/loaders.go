package loaders

import (
	"fmt"
	"time"

	logging "github.com/ipfs/go-log/v2"

	"github.com/hashicorp/golang-lru/v2/expirable"
	"github.com/strahe/curio-dashboard/db"
)

var (
	log           = logging.Logger("loaders")
	ErrorNotFound = fmt.Errorf("not found")
)

type Loader struct {
	db    *db.HarmonyDB
	cache *expirable.LRU[string, any] // low level cache
	MessageLoader
	MarketLoader
	MiningLoader
	ActorLoader
	AlertLoader
	ConfigLoader
	MachineLoader
	PorepLoader
	SectorLoader
	StorageLoader
	TaskLoader
}

func NewLoader(db *db.HarmonyDB, cacheSize int) *Loader {
	loader := &Loader{
		db:    db,
		cache: expirable.NewLRU[string, any](cacheSize, nil, time.Minute),
	}

	loader.ConfigLoader = NewConfigLoader(loader)
	loader.MessageLoader = NewMessageLoader(loader)
	loader.MarketLoader = NewMarketLoader(loader)
	loader.MiningLoader = NewMiningLoader(loader)
	loader.ActorLoader = NewActorLoader(loader)
	loader.AlertLoader = NewAlertLoader(loader)
	loader.MachineLoader = NewMachineLoader(loader)
	loader.PorepLoader = NewPorepLoader(loader)
	loader.SectorLoader = NewSectorLoader(loader)
	loader.StorageLoader = NewStorageLoader(loader)
	loader.TaskLoader = NewTaskLoader(loader)

	return loader
}
