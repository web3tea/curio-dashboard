package loaders

import (
	"context"

	"github.com/strahe/curio-dashboard/graph/model"
)

type MachineLoader interface {
	Machine(ctx context.Context, id int) (*model.Machine, error)
	Machines(ctx context.Context) ([]*model.Machine, error)
	MachineDetails(ctx context.Context) ([]*model.MachineDetail, error)
}

func (l *Loader) Machine(ctx context.Context, id int) (*model.Machine, error) {
	var out model.Machine
	err := l.db.QueryRow(ctx, `SELECT
    id,
    last_contact,
    host_and_port,
    cpu,
    ram,
    gpu
FROM
    harmony_machines
WHERE id = $1`, id).
		Scan(&out.ID, &out.LastContact, &out.HostAndPort, &out.CPU, &out.Gpu, &out.RAM)
	return &out, err
}

func (l *Loader) Machines(ctx context.Context) ([]*model.Machine, error) {
	var out []*model.Machine
	if err := l.db.Select(ctx, &out, `SELECT
    id,
    last_contact,
    host_and_port,
    cpu,
    ram,
    gpu
FROM
    harmony_machines`); err != nil {
		return nil, err
	}
	return out, nil
}

func (l *Loader) MachineDetails(ctx context.Context) ([]*model.MachineDetail, error) {
	var out []*model.MachineDetail
	if err := l.db.Select(ctx, &out, `SELECT
    id,
    tasks,
    layers,
    startup_time,
    miners,
    machine_id,
    machine_name
FROM
    harmony_machine_details
`); err != nil {
		return nil, err
	}
	return out, nil
}
