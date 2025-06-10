package loaders

import (
	"fmt"

	logging "github.com/ipfs/go-log/v2"
	"github.com/jellydator/ttlcache/v3"
	"github.com/web3tea/curio-dashboard/db"
)

var (
	log           = logging.Logger("loaders")
	ErrorNotFound = fmt.Errorf("not found")
)

type Loader struct {
	db    *db.HarmonyDB
	cache *ttlcache.Cache[string, any]
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
	NodeLoader
	IPNILoader
	WdPostLoader
}

func NewLoader(db *db.HarmonyDB, cacheSize int) *Loader {
	loader := &Loader{
		db:    db,
		cache: ttlcache.New[string, any](),
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
	loader.NodeLoader = NewNodeLoader(loader)
	loader.IPNILoader = NewIPNILoader(loader)
	loader.WdPostLoader = NewWdPostLoader(loader)

	return loader
}
