package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.55

import (
	"context"

	"github.com/filecoin-project/curio/web/api/webrpc"
	"github.com/samber/lo"
	"github.com/strahe/curio-dashboard/graph/model"
)

// MarketAddPriceFilter is the resolver for the marketAddPriceFilter field.
func (r *mutationResolver) MarketAddPriceFilter(ctx context.Context, input model.PriceFilterInput) (bool, error) {
	err := r.curioAPI.AddPriceFilters(ctx, input.Name, input.MinDurationDays, input.MaxDurationDays, int64(input.MinimumSize), int64(input.MaximumSize), int64(input.Price), input.Verified)
	if err != nil {
		return false, err
	}

	return true, nil
}

// MarketUpdatePriceFilter is the resolver for the marketUpdatePriceFilter field.
func (r *mutationResolver) MarketUpdatePriceFilter(ctx context.Context, input model.PriceFilterInput) (*model.PriceFilter, error) {
	err := r.curioAPI.SetPriceFilters(ctx, input.Name, input.MinDurationDays, input.MaxDurationDays, int64(input.MinimumSize), int64(input.MaximumSize), int64(input.Price), input.Verified)
	if err != nil {
		return nil, err
	}

	return r.Query().MarketPriceFilter(ctx, input.Name)
}

// MarketDeletePriceFilter is the resolver for the marketDeletePriceFilter field.
func (r *mutationResolver) MarketDeletePriceFilter(ctx context.Context, name string) (bool, error) {
	err := r.curioAPI.RemovePricingFilter(ctx, name)
	if err != nil {
		return false, err
	}
	return true, nil
}

// MakretPriceFilters is the resolver for the makretPriceFilters field.
func (r *queryResolver) MakretPriceFilters(ctx context.Context) ([]*model.PriceFilter, error) {
	res, err := r.curioAPI.GetPriceFilters(ctx)
	if err != nil {
		return nil, err
	}
	return lo.Map(res, func(item webrpc.PriceFilter, index int) *model.PriceFilter {
		return &model.PriceFilter{
			Name:            item.Name,
			MinDurationDays: item.MinDur,
			MaxDurationDays: item.MaxDur,
			MinimumSize:     int(item.MinSize),
			MaximumSize:     int(item.MaxSize),
			Price:           int(item.Price),
			Verified:        item.Verified,
		}
	}), nil
}

// MarketPriceFilter is the resolver for the marketPriceFilter field.
func (r *queryResolver) MarketPriceFilter(ctx context.Context, name string) (*model.PriceFilter, error) {
	res, err := r.loader.MarketMk12PriceFilter(ctx, name)
	if err != nil {
		return nil, err
	}
	return &model.PriceFilter{
		Name:            res.Name,
		MinDurationDays: res.MinDur,
		MaxDurationDays: res.MaxDur,
		MinimumSize:     int(res.MinSize),
		MaximumSize:     int(res.MaxSize),
		Price:           int(res.Price),
		Verified:        res.Verified,
	}, nil
}

// MarketCheckPriceFilter is the resolver for the marketCheckPriceFilter field.
func (r *queryResolver) MarketCheckPriceFilter(ctx context.Context, name string) (bool, error) {
	res, _ := r.MarketPriceFilter(ctx, name) // nolint: errcheck
	return res != nil, nil
}
