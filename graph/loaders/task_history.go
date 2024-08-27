package loaders

import (
	"context"
	"time"

	"github.com/strahe/curio-dashboard/graph/model"
)

// TaskHistories is the resolver for the taskHistories field.
func (l *Loader) TaskHistories(ctx context.Context, offset int, limit int) ([]*model.TaskHistory, error) {
	var out []*model.TaskHistory
	if err := l.db.Select(ctx, &out, "SELECT * FROM harmony_task_history ORDER BY work_end desc LIMIT $1 OFFSET $2", limit, offset); err != nil {
		return nil, err
	}
	return out, nil
}

func (l *Loader) SubCompletedTask(ctx context.Context, last int) (<-chan *model.TaskHistory, error) {
	taskChan := make(chan *model.TaskHistory)

	go func() {
		defer close(taskChan)
		ticker := time.NewTicker(time.Second * 3)
		defer ticker.Stop()
		var offset time.Time

		if last < 1 {
			last = 1
		}
		var tasks []*model.TaskHistory
		if err := l.db.Select(ctx, &tasks, "SELECT * FROM harmony_task_history ORDER BY id DESC LIMIT $1", last); err != nil {
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
				if err := l.db.Select(ctx, &tasks, "SELECT * FROM harmony_task_history WHERE work_end > $1 ORDER BY work_end", offset); err != nil {
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
