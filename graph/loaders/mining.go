package loaders

import (
	"context"

	"github.com/strahe/curio-dashboard/graph/model"
)

func (l *Loader) MiningSummaryByDay(ctx context.Context, lastDays int) ([]*model.MiningSummaryDay, error) {
	if lastDays <= 0 {
		lastDays = 1 // Default to 1 day if a non-positive number is provided
	}
	var m []*model.MiningSummaryDay
	err := l.db.Select(ctx, &m,
		`SELECT
        sp_id,
        DATE(mined_at) AS day,
        COUNT(*) AS won
    FROM
        mining_tasks
    WHERE
        won = true AND
        mined_at >= current_date - $1::integer
    GROUP BY
        sp_id,
        DATE(mined_at)
    ORDER BY
        day ASC, sp_id;`, lastDays)
	if err != nil {
		return nil, err
	}
	return m, nil
}
