package loaders

import (
	"context"

	"github.com/strahe/curio-dashboard/graph/model"
)

type StorageLoader interface {
	StoragePaths(ctx context.Context) ([]*model.StoragePath, error)
	StorageStats(ctx context.Context) ([]*model.StorageStats, error)
}

func (l *Loader) StoragePaths(ctx context.Context) ([]*model.StoragePath, error) {
	var m []*model.StoragePath
	if err := l.db.Select(ctx, &m, `SELECT
    storage_id,
    urls,
    weight,
    max_storage,
    can_seal,
    can_store,
    groups,
    allow_to,
    allow_types,
    deny_types,
    capacity,
    available,
    fs_available,
    reserved,
    used,
    last_heartbeat,
    heartbeat_err,
    allow_miners,
    deny_miners
FROM
    storage_path
`); err != nil {
		return nil, err
	}
	return m, nil
}

func (l *Loader) StorageStats(ctx context.Context) ([]*model.StorageStats, error) {
	paths, err := l.StoragePaths(ctx)
	if err != nil {
		return nil, err
	}

	statsMap := make(map[model.StorageType]*model.StorageStats)
	var countFor = func(group *model.StorageStats, path *model.StoragePath) {
		group.TotalAvailable += path.Available
		group.TotalCapacity += path.Capacity
		group.TotalFsAvailable += path.FsAvailable
		group.TotalUsed += path.Used
		group.TotalReserved += path.Reserved
	}

	for _, path := range paths {
		storageType := model.StorageTypeReadonly
		switch {
		case path.CanSeal && path.CanStore:
			storageType = model.StorageTypeHybrid
		case path.CanStore:
			storageType = model.StorageTypeStore
		case path.CanSeal:
			storageType = model.StorageTypeSeal
		}

		group, exists := statsMap[storageType]
		if !exists {
			group = &model.StorageStats{Type: storageType}
			statsMap[storageType] = group
		}

		countFor(group, path)
	}

	// Convert the map to a slice
	var res []*model.StorageStats
	for _, group := range statsMap {
		res = append(res, group)
	}

	return res, nil
}
