package loaders

import (
	"context"
	"time"

	"github.com/strahe/curio-dashboard/graph/model"
)

func (l *Loader) TaskAggregatesByDay(_ context.Context, start, end time.Time) ([]*model.TaskAggregate, error) {
	var out []*model.TaskAggregate

	err := l.appDB.Raw(`SELECT
    DATE(time) AS time,
    SUM(total) AS total,
    SUM(failure) AS failure,
    SUM(success) AS success
FROM
    task_history_aggregates
WHERE
    time BETWEEN ? AND ?
GROUP BY
    time
ORDER BY
    time DESC;`, start, end).Scan(&out).Error
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (l *Loader) TaskAggregatesByHour(_ context.Context, start, end time.Time) ([]*model.TaskAggregate, error) {
	var out []*model.TaskAggregate

	err := l.appDB.Raw(`SELECT
    time,
    SUM(total) AS total,
    SUM(failure) AS failure,
    SUM(success) AS success
FROM
    task_history_aggregates
WHERE
    time BETWEEN ? AND ?
GROUP BY
    time
ORDER BY
    time;`, start, end).Scan(&out).Error
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (l *Loader) TaskAggregatesByTask(_ context.Context, start, end time.Time) ([]*model.TaskNameAggregate, error) {
	var out []*model.TaskNameAggregate

	err := l.appDB.Raw(`SELECT
    task,
    SUM(total) AS total,
    SUM(failure) AS failure,
    SUM(success) AS success
FROM
    task_history_aggregates
WHERE
    time BETWEEN ? AND ?
GROUP BY
    task`, start, end).Scan(&out).Error
	if err != nil {
		return nil, err
	}
	return out, nil
}

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
