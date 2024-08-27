package loaders

import (
	"context"

	"github.com/strahe/curio-dashboard/graph/model"
)

func (l *Loader) Task(ctx context.Context, id int) (*model.Task, error) {
	var out model.Task
	err := l.db.QueryRow(ctx, `SELECT id,initiated_by,update_time,posted_time,owner_id,added_by,previous_task,name FROM harmony_task WHERE id = $1`, id).
		Scan(&out.ID, &out.InitiatedByID, &out.UpdateTime, &out.PostedTime, &out.OwnerID, &out.AddedByID, &out.PreviousTaskID, &out.Name)
	return &out, err
}

func (l *Loader) Tasks(ctx context.Context) ([]*model.Task, error) {
	var out []*model.Task
	if err := l.db.Select(ctx, &out, "SELECT * FROM harmony_task"); err != nil {
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
