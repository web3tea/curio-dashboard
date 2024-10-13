package loaders

import (
	"context"
	"fmt"
	"time"

	"github.com/strahe/curio-dashboard/types"

	"github.com/strahe/curio-dashboard/graph/model"
)

type MiningLoader interface {
	MiningSummaryByDay(ctx context.Context, start, end time.Time) ([]*model.MiningSummaryDay, error)
	MiningCount(ctx context.Context, start, end time.Time, actor *types.ActorID) (*model.MiningCount, error)
}

func (l *Loader) MiningSummaryByDay(ctx context.Context, start, end time.Time) ([]*model.MiningSummaryDay, error) {
	if end.IsZero() {
		end = time.Now()
	}
	if end.Before(start) {
		return nil, fmt.Errorf("end time is before start time")
	}

	var result []*model.MiningSummaryDay
	err := l.db.Select(ctx, &result,
		`SELECT
    DATE_TRUNC('day', base_compute_time) AS day,
    sp_id as miner,
    COUNT(*) AS won_block
FROM
    mining_tasks
WHERE
    won = true
  AND base_compute_time BETWEEN $1 AND $2
GROUP BY
    day, sp_id
ORDER BY
    day, sp_id;`, start, end)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (l *Loader) MiningCount(ctx context.Context, start, end time.Time, actor *types.ActorID) (*model.MiningCount, error) {
	if end.IsZero() {
		end = time.Now()
	}
	if end.Before(start) {
		return nil, fmt.Errorf("end time is before start time")
	}
	type mm struct {
		Included bool `db:"included"`
		Count    int  `db:"count"`
	}
	var res []mm

	err := l.db.Select(ctx, &res, `
SELECT
    included,
    COUNT(*) AS count
FROM
    mining_tasks
WHERE
    won = true AND
    ($1 IS NULL OR sp_id = $1) AND
    base_compute_time BETWEEN $2 AND $3
GROUP BY
    included;`, actor, start, end)
	if err != nil {
		return nil, err
	}
	result := &model.MiningCount{}

	for _, r := range res {
		if r.Included {
			result.Include = r.Count
		} else {
			result.Exclude = r.Count
		}
	}
	return result, nil
}
