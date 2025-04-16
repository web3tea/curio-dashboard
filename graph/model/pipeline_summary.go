package model

import "github.com/web3tea/curio-dashboard/types"

type PipelineSummary struct {
	ID types.Address `json:"id" db:"sp_id"`
}
