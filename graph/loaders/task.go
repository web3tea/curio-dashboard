package loaders

import (
	"context"
	"time"

	"github.com/strahe/curio-dashboard/graph/model"
)

type TaskLoader interface {
	Task(ctx context.Context, id int) (*model.Task, error)
	Tasks(ctx context.Context) ([]*model.Task, error)
	TasksCount(ctx context.Context) (int, error)
}

func (l *Loader) Task(ctx context.Context, id int) (*model.Task, error) {
	var out model.Task
	err := l.db.QueryRow(ctx, `SELECT id,initiated_by,update_time,posted_time,owner_id,added_by,previous_task,name FROM harmony_task WHERE id = $1`, id).
		Scan(&out.ID, &out.InitiatedByID, &out.UpdateTime, &out.PostedTime, &out.OwnerID, &out.AddedByID, &out.PreviousTaskID, &out.Name)
	return &out, err
}

func (l *Loader) Tasks(ctx context.Context) ([]*model.Task, error) {
	var out []*model.Task
	if err := l.db.Select(ctx, &out, `SELECT
    id,
    initiated_by,
    update_time,
    posted_time,
    owner_id,
    added_by,
    previous_task,
    name
FROM
    harmony_task`); err != nil {
		return nil, err
	}
	return out, nil
}

// TasksCount returns the number of running tasks in the database.
func (l *Loader) TasksCount(ctx context.Context) (int, error) {
	var count int
	err := l.db.QueryRow(ctx, "SELECT count(*) FROM harmony_task").Scan(&count)
	return count, err
}

func (l *Loader) SubNewTask(ctx context.Context, hostID *int, last int) (<-chan *model.Task, error) {
	taskChan := make(chan *model.Task)

	slog := log.With("hostID", hostID)
	slog.Infof("SubNewTask started")

	go func() {
		var err error
		var offset time.Time

		ticker := time.NewTicker(time.Second * 3)
		defer func() {
			ticker.Stop()
			close(taskChan)
			if err != nil {
				slog.Errorw("SubNewTask", "err", err)
			} else {
				slog.Info("SubNewTask done")
			}
		}()

		if last < 1 {
			last = 1
		}
		var tasks []*model.Task
		if err = l.db.Select(ctx, &tasks, `SELECT
    id,
    initiated_by,
    update_time,
    posted_time,
    owner_id,
    added_by,
    previous_task,
    name
FROM
    harmony_task
WHERE ($1::int IS NULL OR owner_id = $1)
ORDER BY posted_time DESC 
LIMIT $2`, hostID, last); err != nil {
			return
		}
		if len(tasks) > 0 {
			offset = tasks[len(tasks)-1].PostedTime
		}

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				var tasks []*model.Task
				if err = l.db.Select(ctx, &tasks, `SELECT
    id,
    initiated_by,
    update_time,
    posted_time,
    owner_id,
    added_by,
    previous_task,
    name
FROM
    harmony_task
WHERE ($1::int IS NULL OR owner_id = $1)
AND posted_time > $2
ORDER BY posted_time`, hostID, offset); err != nil {
					return
				}
				for _, t := range tasks {
					select {
					case <-ctx.Done():
						return
					case taskChan <- t:
						if offset.Before(t.PostedTime) {
							offset = t.PostedTime
						}
					}
				}
			}
		}
	}()
	return taskChan, nil
}
