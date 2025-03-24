package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.68

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/strahe/curio-dashboard/graph"
	"github.com/strahe/curio-dashboard/graph/cachecontrol"
	"github.com/strahe/curio-dashboard/graph/loaders"
	"github.com/strahe/curio-dashboard/graph/model"
	"github.com/strahe/curio-dashboard/types"
)

// RemoveSector is the resolver for the removeSector field.
func (r *mutationResolver) RemoveSector(ctx context.Context, miner types.Address, sectorNumber int) (bool, error) {
	if err := r.curioAPI.SectorRemove(ctx, int(miner.ID), sectorNumber); err != nil {
		return false, err
	}
	return true, nil
}

// RestartSector is the resolver for the restartSector field.
func (r *mutationResolver) RestartSector(ctx context.Context, miner types.Address, sectorNumber int) (bool, error) {
	if err := r.curioAPI.SectorResume(ctx, int64(miner.ID), int64(sectorNumber)); err != nil {
		return false, err
	}
	return true, nil
}

// RestartAllFailedSectors is the resolver for the restartAllFailedSectors field.
func (r *mutationResolver) RestartAllFailedSectors(ctx context.Context) (bool, error) {
	err := r.curioAPI.PipelinePorepRestartAll(ctx)
	if err != nil {
		return false, err
	}
	return true, err
}

// Sectors is the resolver for the sectors field.
func (r *queryResolver) Sectors(ctx context.Context, actor *types.Address, sectorNumber *int, offset int, limit int) ([]*model.Sector, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, sectorDefaultCacheAge)
	if actor != nil && sectorNumber != nil {
		meta, err := r.loader.SectorMeta(ctx, *actor, *sectorNumber)
		if err != nil {
			return nil, err
		}
		return []*model.Sector{{SpID: *actor, SectorNum: *sectorNumber, Meta: meta}}, nil
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
func (r *queryResolver) SectorsCount(ctx context.Context, actor *types.Address) (int, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute*5)
	return r.loader.SectorsCount(ctx, actor)
}

// Sector is the resolver for the sector field.
func (r *queryResolver) Sector(ctx context.Context, actor types.Address, sectorNumber int) (*model.Sector, error) {
	return &model.Sector{SpID: actor, SectorNum: sectorNumber}, nil
}

// SectorSummary is the resolver for the sectorSummary field.
func (r *queryResolver) SectorSummary(ctx context.Context) (*model.SectorSummary, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, sectorDefaultCacheAge)
	return r.loader.SectorSummary(ctx)
}

// ID is the resolver for the id field.
func (r *sectorResolver) ID(ctx context.Context, obj *model.Sector) (string, error) {
	return fmt.Sprintf("%s:%d", obj.SpID, obj.SectorNum), nil
}

// Status is the resolver for the status field.
func (r *sectorResolver) Status(ctx context.Context, obj *model.Sector) (model.PorepStatus, error) {
	porep, err := r.loader.Porep(ctx, obj.SpID, obj.SectorNum)
	if err == nil {
		r := &porepResolver{r.Resolver}
		return r.Status(ctx, porep)
	}
	_, err = r.loader.SectorMeta(ctx, obj.SpID, obj.SectorNum)
	if err == nil {
		return model.PorepStatusActive, nil
	}
	return model.PorepStatusUnknown, nil
}

// Meta is the resolver for the meta field.
func (r *sectorResolver) Meta(ctx context.Context, obj *model.Sector) (*model.SectorMeta, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, sectorDefaultCacheAge)
	if obj.Meta != nil {
		return obj.Meta, nil
	}
	m, err := r.loader.SectorMeta(ctx, obj.SpID, obj.SectorNum)
	if errors.Is(err, loaders.ErrorNotFound) {
		return nil, nil
	}
	return m, nil
}

// Porep is the resolver for the porep field.
func (r *sectorResolver) Porep(ctx context.Context, obj *model.Sector) (*model.Porep, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, sectorDefaultCacheAge)
	return r.loader.Porep(ctx, obj.SpID, obj.SectorNum)
}

// Locations is the resolver for the locations field.
func (r *sectorResolver) Locations(ctx context.Context, obj *model.Sector) ([]*model.SectorLocation, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, sectorDefaultCacheAge)
	return r.loader.SectorLocations(ctx, obj.SpID, obj.SectorNum)
}

// Pieces is the resolver for the pieces field.
func (r *sectorResolver) Pieces(ctx context.Context, obj *model.Sector) ([]*model.SectorMetaPiece, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, sectorDefaultCacheAge)
	return r.loader.SectorPieces(ctx, obj.SpID, obj.SectorNum)
}

// Tasks is the resolver for the tasks field.
func (r *sectorResolver) Tasks(ctx context.Context, obj *model.Sector) ([]*model.Task, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, sectorDefaultCacheAge)
	return r.loader.SectorTasks(ctx, obj.SpID, obj.SectorNum)
}

// Events is the resolver for the events field.
func (r *sectorResolver) Events(ctx context.Context, obj *model.Sector) ([]*model.TaskHistory, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, sectorDefaultCacheAge)
	return r.loader.SectorEvents(ctx, obj.SpID, obj.SectorNum)
}

// IsPrimary is the resolver for the isPrimary field.
func (r *sectorLocationResolver) IsPrimary(ctx context.Context, obj *model.SectorLocation) (*bool, error) {
	return NullToPtr(obj.IsPrimary), nil
}

// ReadTs is the resolver for the readTs field.
func (r *sectorLocationResolver) ReadTs(ctx context.Context, obj *model.SectorLocation) (*string, error) {
	return NullToPtr(obj.ReadTS), nil
}

// WriteTs is the resolver for the writeTs field.
func (r *sectorLocationResolver) WriteTs(ctx context.Context, obj *model.SectorLocation) (*string, error) {
	return NullToPtr(obj.WriteTS), nil
}

// WriteLockOwner is the resolver for the writeLockOwner field.
func (r *sectorLocationResolver) WriteLockOwner(ctx context.Context, obj *model.SectorLocation) (*string, error) {
	return NullToPtr(obj.WriteLockOwner), nil
}

// Storage is the resolver for the storage field.
func (r *sectorLocationResolver) Storage(ctx context.Context, obj *model.SectorLocation) (*model.Storage, error) {
	return &model.Storage{ID: obj.StorageID}, nil
}

// ID is the resolver for the id field.
func (r *sectorMetaResolver) ID(ctx context.Context, obj *model.SectorMeta) (string, error) {
	return fmt.Sprintf("%s-%d", obj.SpID, obj.SectorNum), nil
}

// MsgCidPrecommit is the resolver for the msgCidPrecommit field.
func (r *sectorMetaResolver) MsgCidPrecommit(ctx context.Context, obj *model.SectorMeta) (*string, error) {
	return NullToPtr(obj.MsgCidPrecommit), nil
}

// MsgCidCommit is the resolver for the msgCidCommit field.
func (r *sectorMetaResolver) MsgCidCommit(ctx context.Context, obj *model.SectorMeta) (*string, error) {
	return NullToPtr(obj.MsgCidCommit), nil
}

// MsgCidUpdate is the resolver for the msgCidUpdate field.
func (r *sectorMetaResolver) MsgCidUpdate(ctx context.Context, obj *model.SectorMeta) (*string, error) {
	return NullToPtr(obj.MsgCidUpdate), nil
}

// ExpirationEpoch is the resolver for the expirationEpoch field.
func (r *sectorMetaResolver) ExpirationEpoch(ctx context.Context, obj *model.SectorMeta) (*int, error) {
	return NullToPtr(obj.ExpirationEpoch), nil
}

// Sector returns graph.SectorResolver implementation.
func (r *Resolver) Sector() graph.SectorResolver { return &sectorResolver{r} }

// SectorLocation returns graph.SectorLocationResolver implementation.
func (r *Resolver) SectorLocation() graph.SectorLocationResolver { return &sectorLocationResolver{r} }

// SectorMeta returns graph.SectorMetaResolver implementation.
func (r *Resolver) SectorMeta() graph.SectorMetaResolver { return &sectorMetaResolver{r} }

type sectorResolver struct{ *Resolver }
type sectorLocationResolver struct{ *Resolver }
type sectorMetaResolver struct{ *Resolver }
