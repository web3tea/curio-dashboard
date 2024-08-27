package model

import "github.com/strahe/curio-dashboard/types"

type PipelineSummary struct {
	ID types.ActorID `json:"id" db:"sp_id"`
}
