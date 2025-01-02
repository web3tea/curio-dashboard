package loaders

import (
	"context"
	"time"
)

type TaskHistory struct {
	Hour    time.Time
	Name    string
	Total   int
	Success int
	Failure int
}

func (l *Loader) AggregateTaskHistory(ctx context.Context, startTime, endTime time.Time) ([]*TaskHistory, error) {
	var agg []*TaskHistory
	err := l.db.Select(ctx, &agg, `SELECT
    name,
    DATE_TRUNC('hour', work_end) AS hour,
    COUNT(*) AS total,
    COUNT(CASE WHEN result = 'true' THEN 1 END) AS success,
    COUNT(CASE WHEN result = 'false' THEN 1 END) AS failure
FROM
    harmony_task_history
WHERE
    work_end BETWEEN $1 AND $2
GROUP BY
    hour, name;`, startTime, endTime)

	if err != nil {
		return nil, err
	}
	return agg, nil
}
