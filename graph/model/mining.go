package model

import (
	"time"

	"github.com/strahe/curio-dashboard/types"
)

type MiningCountSummary struct {
	Start    time.Time      `json:"start"`
	End      time.Time      `json:"end"`
	Actor    *types.Address `json:"-"` // actor use for filtering
	Total    int            `json:"total"`
	Won      int            `json:"won"`
	Included int            `json:"include"`
}
