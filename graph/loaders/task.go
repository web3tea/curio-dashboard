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
	TaskNames(ctx context.Context) ([]string, error)
	SubNewTask(ctx context.Context, hostID *int, last int) (<-chan *model.Task, error)
	TaskHistories(ctx context.Context, timeStart *time.Time, timeEnd *time.Time, hostPort *string, name *string, result *bool, offset int, limit int) ([]*model.TaskHistory, error)
	SubCompletedTask(ctx context.Context, hostPort *string, last int) (<-chan *model.TaskHistory, error)
	TaskHistoriesCount(ctx context.Context, start, end *time.Time, hostPort, name *string, result *bool) (int, error)
	TaskHistoriesAggregate(ctx context.Context, start, end time.Time, interval model.TaskHistoriesAggregateInterval) ([]*model.TaskAggregate, error)
	TasksStats(ctx context.Context, start, end time.Time, machine *string) ([]*model.TaskStats, error)
}

type TaskLoaderImpl struct {
	loader *Loader
}

func NewTaskLoader(loader *Loader) TaskLoader {
	return &TaskLoaderImpl{loader}
}

func (l *TaskLoaderImpl) Task(ctx context.Context, id int) (*model.Task, error) {
	var out model.Task
	err := l.loader.db.QueryRow(ctx, `SELECT id,initiated_by,update_time,posted_time,owner_id,added_by,previous_task,name FROM harmony_task WHERE id = $1`, id).
		Scan(&out.ID, &out.InitiatedByID, &out.UpdateTime, &out.PostedTime, &out.OwnerID, &out.AddedByID, &out.PreviousTaskID, &out.Name)
	return &out, err
}

func (l *TaskLoaderImpl) Tasks(ctx context.Context) ([]*model.Task, error) {
	var out []*model.Task
	if err := l.loader.db.Select(ctx, &out, `SELECT
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
func (l *TaskLoaderImpl) TasksCount(ctx context.Context) (int, error) {
	var count int
	err := l.loader.db.QueryRow(ctx, "SELECT count(*) FROM harmony_task").Scan(&count)
	return count, err
}

func (l *TaskLoaderImpl) SubNewTask(ctx context.Context, hostID *int, last int) (<-chan *model.Task, error) {
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
		if err = l.loader.db.Select(ctx, &tasks, `SELECT
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
				if err = l.loader.db.Select(ctx, &tasks, `SELECT
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

func (l *TaskLoaderImpl) TaskNames(ctx context.Context) ([]string, error) {
	var out []string
	if err := l.loader.db.Select(ctx, &out, `SELECT DISTINCT name FROM harmony_task_history;`); err != nil {
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

func (l *TaskLoaderImpl) AggregateTaskHistory(ctx context.Context, startTime, endTime time.Time) ([]*TaskHistory, error) {
	var agg []*TaskHistory
	err := l.loader.db.Select(ctx, &agg, `SELECT
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

// TaskHistories is the resolver for the taskHistories field.
func (l *TaskLoaderImpl) TaskHistories(ctx context.Context, timeStart *time.Time, timeEnd *time.Time, hostPort *string, name *string, result *bool, offset int, limit int) ([]*model.TaskHistory, error) {
	var out []*model.TaskHistory
	query := `SELECT
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
WHERE
    ($1::timestamp IS NULL OR work_end >= $1) AND
    ($2::timestamp IS NULL OR work_end <= $2) AND
    ($3::text IS NULL OR completed_by_host_and_port = $3) AND
    ($4::text IS NULL OR name = $4) AND
    ($5::boolean IS NULL OR result = $5)
ORDER BY work_end desc LIMIT $6 OFFSET $7`
	if err := l.loader.db.Select(ctx, &out, query, timeStart, timeEnd, hostPort, name, result, limit, offset); err != nil {
		return nil, err
	}
	return out, nil
}

// TaskHistoriesCount Count the number of task histories between start and end time
func (l *TaskLoaderImpl) TaskHistoriesCount(ctx context.Context, start, end *time.Time, hostPort, name *string, result *bool) (int, error) {
	var count int
	query := `SELECT COUNT(*)
	FROM harmony_task_history
	WHERE ($1::timestamp IS NULL OR work_end >= $1)
	AND ($2::timestamp IS NULL OR work_end <= $2)
	AND ($3::text IS NULL OR completed_by_host_and_port = $3)
	AND ($4::text IS NULL OR name = $4)
	AND ($5::boolean IS NULL OR result = $5)`
	err := l.loader.db.QueryRow(ctx, query, start, end, hostPort, name, result).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}

func (l *TaskLoaderImpl) SubCompletedTask(ctx context.Context, hostPort *string, last int) (<-chan *model.TaskHistory, error) {
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
		if err = l.loader.db.Select(ctx, &tasks, `SELECT
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
				if err = l.loader.db.Select(ctx, &tasks, `SELECT
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

func (l *TaskLoaderImpl) TaskHistoriesAggregate(ctx context.Context, start, end time.Time, interval model.TaskHistoriesAggregateInterval) ([]*model.TaskAggregate, error) {
	var out []*model.TaskAggregate
	err := l.loader.db.Select(ctx, &out, `
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

func (l *TaskLoaderImpl) TasksStats(ctx context.Context, start, end time.Time, machine *string) ([]*model.TaskStats, error) {
	var stats []*model.TaskStats
	err := l.loader.db.Select(ctx, &stats, `
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
