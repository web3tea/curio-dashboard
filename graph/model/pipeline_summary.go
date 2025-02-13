package model

import "github.com/strahe/curio-dashboard/types"

type PipelineSummary struct {
	ID types.Address `json:"id" db:"sp_id"`
}
