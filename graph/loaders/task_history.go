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
	SubCompletedTask(ctx context.Context, last int) (<-chan *model.TaskHistory, error)
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

func (l *Loader) SubCompletedTask(ctx context.Context, last int) (<-chan *model.TaskHistory, error) {
	taskChan := make(chan *model.TaskHistory)

	log.Infof("SubCompletedTask: last=%d", last)
	go func() {
		var err error
		var offset time.Time

		ticker := time.NewTicker(time.Second * 3)
		defer func() {
			ticker.Stop()
			close(taskChan)
			if err != nil {
				log.Infof("SubCompletedTask done, err: %v", err)
			} else {
				log.Infof("SubCompletedTask done")
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
ORDER BY id DESC 
LIMIT $1`, last); err != nil {
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
WHERE work_end > $1 
ORDER BY work_end`, offset); err != nil {
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
