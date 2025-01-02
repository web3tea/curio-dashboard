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
}

func NewLoader(db *db.HarmonyDB, cacheSize int) *Loader {
	return &Loader{
		db:            db,
		cache:         expirable.NewLRU[string, any](cacheSize, nil, time.Minute),
		MessageLoader: NewMessageLoader(db),
	}
}
