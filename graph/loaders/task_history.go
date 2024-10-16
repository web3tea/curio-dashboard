package loaders

import (
	"context"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/strahe/curio-dashboard/graph/model"
)

type TaskHistoryLoader interface {
	TaskHistories(ctx context.Context, offset int, limit int) ([]*model.TaskHistory, error)
	SubCompletedTask(ctx context.Context, hostPort *string, last int) (<-chan *model.TaskHistory, error)
	TaskHistoriesCount(ctx context.Context, start, end time.Time, name *string) (int, error)
}

// TaskHistories is the resolver for the taskHistories field.
func (l *Loader) TaskHistories(ctx context.Context, offset int, limit int) ([]*model.TaskHistory, error) {
	var out []*model.TaskHistory
	if err := l.db.Select(ctx, &out, `SELECT
    id,
    task_id,
    name,
    posted,
    work_start,
    work_end,
    result,
    err,
    completed_by_host_and_port
FROM
    harmony_task_history
ORDER BY work_end desc LIMIT $1 OFFSET $2`, limit, offset); err != nil {
		return nil, err
	}
	return out, nil
}

// TaskHistoriesCount Count the number of task histories between start and end time
func (l *Loader) TaskHistoriesCount(ctx context.Context, start, end time.Time, machine, name *string, success *bool) (int, error) {
	var count int
	var row pgx.Row

	query := "SELECT COUNT(*) FROM harmony_task_history WHERE work_end BETWEEN $1 AND $2"
	args := []interface{}{start, end}
	index := 3

	if machine != nil {
		query += " AND completed_by_host_and_port = $" + strconv.Itoa(index)
		args = append(args, *machine)
		index++
	}
	if name != nil {
		query += " AND name = $" + strconv.Itoa(index)
		args = append(args, *name)
		index++
	}
	if success != nil {
		query += " AND result = $" + strconv.Itoa(index)
		args = append(args, *success)
	}

	row = l.db.QueryRow(ctx, query, args...)
	return count, row.Scan(&count)
}

func (l *Loader) SubCompletedTask(ctx context.Context, hostPort *string, last int) (<-chan *model.TaskHistory, error) {
	taskChan := make(chan *model.TaskHistory)

	slog := log.With("hostPort", hostPort, "last", last)

	slog.Infof("SubCompletedTask start")

	go func() {
		var err error
		var offset time.Time

		ticker := time.NewTicker(time.Second * 3)
		defer func() {
			ticker.Stop()
			close(taskChan)
			if err != nil {
				slog.Errorw("SubCompletedTask", "err", err)
			} else {
				slog.Info("SubCompletedTask done")
			}
		}()

		if last < 1 {
			last = 1
		}
		var tasks []*model.TaskHistory
		if err = l.db.Select(ctx, &tasks, `SELECT
    id,
    task_id,
    name,
    posted,
    work_start,
    work_end,
    result,
    err,
    completed_by_host_and_port
FROM
    harmony_task_history
WHERE ($1::text IS NULL OR completed_by_host_and_port = $1)
ORDER BY work_end DESC 
LIMIT $2`, hostPort, last); err != nil {
			return
		}
		if len(tasks) > 0 {
			offset = tasks[len(tasks)-1].WorkEnd
		}

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				var tasks []*model.TaskHistory
				if err = l.db.Select(ctx, &tasks, `SELECT
    id,
    task_id,
    name,
    posted,
    work_start,
    work_end,
    result,
    err,
    completed_by_host_and_port
FROM
    harmony_task_history
WHERE work_end > $2
AND ($1::text IS NULL OR completed_by_host_and_port = $1)
ORDER BY work_end`, hostPort, offset); err != nil {
					return
				}
				for _, t := range tasks {
					select {
					case <-ctx.Done():
						return
					case taskChan <- t:
						if offset.Before(t.WorkEnd) {
							offset = t.WorkEnd
						}
					}
				}
			}
		}
	}()
	return taskChan, nil
}

func (l *Loader) TaskHistoriesAggregate(ctx context.Context, start, end time.Time, interval model.TaskHistoriesAggregateInterval) ([]*model.TaskAggregate, error) {
	var out []*model.TaskAggregate
	err := l.db.Select(ctx, &out, `
SELECT
    DATE_TRUNC($1, work_end) AS time,
    COUNT(*) AS total,
    COUNT(CASE WHEN result = true THEN 1 END) AS success,
    COUNT(CASE WHEN result = false THEN 1 END) AS failure
FROM
    harmony_task_history
WHERE
    work_end BETWEEN $2 AND $3
GROUP BY
    time
ORDER BY
    time;
`, interval, start, end)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (l *Loader) TasksStats(ctx context.Context, start, end time.Time, machine *string) ([]*model.TaskStats, error) {
	var stats []*model.TaskStats
	err := l.db.Select(ctx, &stats, `
SELECT name, count(case when result = 'true' then 1 end) as success,
		count(case when result = 'false' then 1 end) as failure, count(*) as total
FROM harmony_task_history 
WHERE work_end BETWEEN $1 AND $2
  AND ($3::text IS NULL OR completed_by_host_and_port = $3)
GROUP BY name 
ORDER BY total desc`, start, end, machine)

	if err != nil {
		return nil, err
	}
	return stats, nil
}
