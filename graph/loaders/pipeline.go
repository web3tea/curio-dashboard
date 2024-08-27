package loaders

import (
	"context"

	"github.com/strahe/curio-dashboard/graph/model"
)

func (l *Loader) Pipelines(ctx context.Context) ([]*model.Pipeline, error) {
	var ms []*model.Pipeline
	if err := l.db.Select(ctx, &ms, "SELECT * FROM sectors_sdr_pipeline ORDER BY create_time"); err != nil {
		return nil, err
	}
	return ms, nil
}

func (l *Loader) PipelinesSummary(ctx context.Context) ([]*model.PipelineSummary, error) {
	var ms []*model.PipelineSummary
	err := l.db.Select(ctx, &ms, "SELECT DISTINCT sp_id FROM sectors_sdr_pipeline")
	return ms, err
}
