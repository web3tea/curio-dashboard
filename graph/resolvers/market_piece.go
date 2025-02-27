package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.55

import (
	"context"
	"time"

	"github.com/strahe/curio-dashboard/graph"
	"github.com/strahe/curio-dashboard/graph/cachecontrol"
	"github.com/strahe/curio-dashboard/graph/model"
	"github.com/strahe/curio-dashboard/types"
)

// Metadata is the resolver for the metadata field.
func (r *marketPieceInfoResolver) Metadata(ctx context.Context, obj *model.MarketPieceInfo) (*model.MarketPieceMetadata, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute)
	return r.loader.MarketPieceMetadata(ctx, obj.Cid)
}

// Deals is the resolver for the deals field.
func (r *marketPieceInfoResolver) Deals(ctx context.Context, obj *model.MarketPieceInfo) ([]*model.MarketPieceDeal, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute)
	return r.loader.MakretPieceDeals(ctx, obj.Cid)
}

// MarketPieceInfo is the resolver for the marketPieceInfo field.
func (r *queryResolver) MarketPieceInfo(ctx context.Context, id types.Cid) (*model.MarketPieceInfo, error) {
	return &model.MarketPieceInfo{
		Cid: id,
	}, nil
}

// MarketPieceInfo returns graph.MarketPieceInfoResolver implementation.
func (r *Resolver) MarketPieceInfo() graph.MarketPieceInfoResolver {
	return &marketPieceInfoResolver{r}
}

type marketPieceInfoResolver struct{ *Resolver }
