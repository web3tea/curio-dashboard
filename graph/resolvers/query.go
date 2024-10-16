package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.49

import (
	"context"
	"fmt"
	"time"

	"github.com/filecoin-project/lotus/api"
	types2 "github.com/filecoin-project/lotus/chain/types"
	"github.com/strahe/curio-dashboard/graph"
	"github.com/strahe/curio-dashboard/graph/cachecontrol"
	"github.com/strahe/curio-dashboard/graph/model"
	"github.com/strahe/curio-dashboard/types"
)

// Config is the resolver for the config field.
func (r *queryResolver) Config(ctx context.Context, layer string) (*model.Config, error) {
	return r.loader.Config(ctx, layer)
}

// Configs is the resolver for the configs field.
func (r *queryResolver) Configs(ctx context.Context) ([]*model.Config, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute)
	return r.loader.Configs(ctx)
}

// Machine is the resolver for the machine field.
func (r *queryResolver) Machine(ctx context.Context, id int) (*model.Machine, error) {
	return r.loader.Machine(ctx, id)
}

// Machines is the resolver for the machines field.
func (r *queryResolver) Machines(ctx context.Context) ([]*model.Machine, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute)
	return r.loader.Machines(ctx)
}

// MachineSummary is the resolver for the machineSummary field.
func (r *queryResolver) MachineSummary(ctx context.Context) (*model.MachineSummary, error) {
	return &model.MachineSummary{}, nil
}

// Task is the resolver for the task field.
func (r *queryResolver) Task(ctx context.Context, id int) (*model.Task, error) {
	return r.loader.Task(ctx, id)
}

// Tasks is the resolver for the tasks field.
func (r *queryResolver) Tasks(ctx context.Context) ([]*model.Task, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute)
	return r.loader.Tasks(ctx)
}

// TasksCount is the resolver for the tasksCount field.
func (r *queryResolver) TasksCount(ctx context.Context) (int, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute)
	return r.loader.TasksCount(ctx)
}

// TaskHistories is the resolver for the taskHistories field.
func (r *queryResolver) TaskHistories(ctx context.Context, offset int, limit int) ([]*model.TaskHistory, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute*5)
	return r.loader.TaskHistories(ctx, offset, limit)
}

// TaskHistoriesCount is the resolver for the taskHistoriesCount field.
func (r *queryResolver) TaskHistoriesCount(ctx context.Context, start time.Time, end time.Time, machine *string, name *string, success *bool) (int, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute*5)
	return r.loader.TaskHistoriesCount(ctx, start, end, machine, name, success)
}

// TaskHistoriesAggregate is the resolver for the taskHistoriesAggregate field.
func (r *queryResolver) TaskHistoriesAggregate(ctx context.Context, start time.Time, end time.Time, interval model.TaskHistoriesAggregateInterval) ([]*model.TaskAggregate, error) {
	if start.IsZero() || end.IsZero() {
		return nil, fmt.Errorf("start and end time must be provided")
	}
	if start.After(end) {
		return nil, fmt.Errorf("start time must be before end time")
	}
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute*5)
	return r.loader.TaskHistoriesAggregate(ctx, start, end, interval)
}

// TasksStats is the resolver for the tasksStats field.
func (r *queryResolver) TasksStats(ctx context.Context, start time.Time, end time.Time, machine *string) ([]*model.TaskStats, error) {
	stats, err := r.loader.TasksStats(ctx, start, end, machine)
	if err != nil {
		return nil, err
	}
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute*5)
	return stats, nil
}

// StoragePaths is the resolver for the storagePaths field.
func (r *queryResolver) StoragePaths(ctx context.Context) ([]*model.StoragePath, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute*5)
	return r.loader.StoragePaths(ctx)
}

// StorageStats is the resolver for the storageStats field.
func (r *queryResolver) StorageStats(ctx context.Context) ([]*model.StorageStats, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute*5)
	return r.loader.StorageStats(ctx)
}

// Sectors is the resolver for the sectors field.
func (r *queryResolver) Sectors(ctx context.Context, actor *types.ActorID, sectorNumber *int, offset int, limit int) ([]*model.Sector, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, sectorDefaultCacheAge)
	if actor != nil && sectorNumber != nil {
		return []*model.Sector{{SpID: *actor, SectorNum: *sectorNumber}}, nil
	}
	metas, err := r.loader.SectorMetas(ctx, actor, offset, limit)
	if err != nil {
		return nil, err
	}
	var out []*model.Sector
	for _, meta := range metas {
		out = append(out, &model.Sector{
			SpID:      meta.SpID,
			SectorNum: meta.SectorNum,
			Meta:      meta,
		})
	}
	return out, nil
}

// SectorsCount is the resolver for the sectorsCount field.
func (r *queryResolver) SectorsCount(ctx context.Context, actor *types.ActorID) (int, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute*5)
	return r.loader.SectorsCount(ctx, actor)
}

// Sector is the resolver for the sector field.
func (r *queryResolver) Sector(ctx context.Context, actor types.ActorID, sectorNumber int) (*model.Sector, error) {
	return &model.Sector{SpID: actor, SectorNum: sectorNumber}, nil
}

// Actors is the resolver for the actors field.
func (r *queryResolver) Actors(ctx context.Context) ([]*model.Actor, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute*5)
	return r.loader.Actors(ctx)
}

// Actor is the resolver for the actor field.
func (r *queryResolver) Actor(ctx context.Context, address types.Address) (*model.Actor, error) {
	return r.loader.Actor(ctx, address)
}

// Poreps is the resolver for the poreps field.
func (r *queryResolver) Poreps(ctx context.Context) ([]*model.Porep, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute*5)
	return r.loader.Poreps(ctx)
}

// Porep is the resolver for the porep field.
func (r *queryResolver) Porep(ctx context.Context, sp types.ActorID, sectorNumber int) (*model.Porep, error) {
	return r.loader.Porep(ctx, sp, sectorNumber)
}

// PipelinesSummary is the resolver for the pipelinesSummary field.
func (r *queryResolver) PipelinesSummary(ctx context.Context) ([]*model.PipelineSummary, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute*5)
	return r.loader.PipelinesSummary(ctx)
}

// NodesInfo is the resolver for the nodesInfo field.
func (r *queryResolver) NodesInfo(ctx context.Context) ([]*model.NodeInfo, error) {
	infos, err := r.curioAPI.SyncerState(ctx)
	if err != nil {
		return nil, err
	}

	var out []*model.NodeInfo
	for _, info := range infos {
		out = append(out, &model.NodeInfo{
			ID:        info.Address,
			Address:   info.Address,
			Layers:    info.CLayers,
			Reachable: info.Reachable,
			SyncState: info.SyncState,
			Version:   info.Version,
		})
	}

	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Second*30)
	return out, nil
}

// MiningSummaryByDay is the resolver for the miningSummaryByDay field.
func (r *queryResolver) MiningSummaryByDay(ctx context.Context, start time.Time, end time.Time) ([]*model.MiningSummaryDay, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Hour)
	return r.loader.MiningSummaryByDay(ctx, start, end)
}

// MiningCount is the resolver for the miningCount field.
func (r *queryResolver) MiningCount(ctx context.Context, start time.Time, end time.Time, actor *types.ActorID) (*model.MiningCount, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute*5)
	return r.loader.MiningCount(ctx, start, end, actor)
}

// DealsPending is the resolver for the dealsPending field.
func (r *queryResolver) DealsPending(ctx context.Context) ([]*model.OpenSectorPiece, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute)
	return r.loader.OpenSectorPieces(ctx)
}

// Alerts is the resolver for the alerts field.
func (r *queryResolver) Alerts(ctx context.Context) ([]*model.Alert, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute)
	return r.loader.Alerts(ctx)
}

// MetricsActiveTasks is the resolver for the metricsActiveTasks field.
func (r *queryResolver) MetricsActiveTasks(ctx context.Context, lastDays int, machine *string) ([]*model.MetricsActiveTask, error) {
	if !r.cfg.Features.Metrics.Enabled {
		return nil, fmt.Errorf("metrics feature is disabled")
	}

	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute*10)

	end := time.Now()
	start := end.Add(-time.Hour * 24 * time.Duration(lastDays))

	return r.prometheusClient.RangeActiveTasks(ctx, start, end, machine)
}

// Miner is the resolver for the miner field.
func (r *queryResolver) Miner(ctx context.Context, address types.Address) (*model.Miner, error) {
	act, err := r.fullNode.StateGetActor(ctx, address.Address, types2.EmptyTSK)
	if err != nil {
		return nil, err
	}
	return &model.Miner{
		ID:    address,
		Actor: *act,
	}, nil
}

// MinerPower is the resolver for the minerPower field.
func (r *queryResolver) MinerPower(ctx context.Context, address *types.Address) (*model.MinerPower, error) {
	var (
		rawPower    = types2.NewInt(0)
		qaPower     = types2.NewInt(0)
		mp          *api.MinerPower // the last miner power
		err         error
		handlePower = func(ctx context.Context, addr types.Address) error {
			mp, err = r.fullNode.StateMinerPower(ctx, addr.Address, types2.EmptyTSK)
			if err != nil {
				return fmt.Errorf("failed to get miner power: %w", err)
			}
			rawPower.Add(rawPower.Int, mp.MinerPower.RawBytePower.Int)
			qaPower.Add(qaPower.Int, mp.MinerPower.QualityAdjPower.Int)
			return nil
		}
	)

	if address != nil {
		if err := handlePower(ctx, *address); err != nil {
			return nil, err
		}
	} else {
		actors, err := r.loader.Actors(ctx)
		if err != nil {
			return nil, fmt.Errorf("failed to get actors: %w", err)
		}
		for _, act := range actors {
			if err := handlePower(ctx, act.Address); err != nil {
				return nil, err
			}
		}
	}
	out := &model.MinerPower{
		MinerPower: &model.PowerClaim{
			RawBytePower:    &types.BigInt{Int: rawPower.Int},
			QualityAdjPower: &types.BigInt{Int: qaPower.Int},
		},
	}
	if mp != nil {
		out.TotalPower = &model.PowerClaim{
			RawBytePower:    &types.BigInt{Int: mp.TotalPower.RawBytePower.Int},
			QualityAdjPower: &types.BigInt{Int: mp.TotalPower.QualityAdjPower.Int},
		}
	}
	if address != nil {
		out.ID = address.String()
	}
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Hour)
	return out, nil
}

// Query returns graph.QueryResolver implementation.
func (r *Resolver) Query() graph.QueryResolver { return &queryResolver{r} }

type queryResolver struct{ *Resolver }
