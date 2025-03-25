package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.68

import (
	"context"
	"fmt"
	"time"

	"github.com/strahe/curio-dashboard/graph/cachecontrol"
	"github.com/strahe/curio-dashboard/graph/model"
)

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
