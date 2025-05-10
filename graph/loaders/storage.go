package loaders

import (
	"context"
	"fmt"

	"github.com/web3tea/curio-dashboard/graph/model"
)

type StorageLoader interface {
	StoragePath(ctx context.Context, id string) (*model.StoragePath, error)
	StoragePaths(ctx context.Context) ([]*model.StoragePath, error)
	StorageStats(ctx context.Context) ([]*model.StorageStats, error)
	StorageLiveness(ctx context.Context, id string) (*model.StorageLiveness, error)
}

type StorageLoaderImpl struct {
	loader *Loader
}

func NewStorageLoader(loader *Loader) StorageLoader {
	return &StorageLoaderImpl{loader}
}

func (l *StorageLoaderImpl) StoragePath(ctx context.Context, id string) (*model.StoragePath, error) {
	var m []*model.StoragePath
	if err := l.loader.db.Select(ctx, &m, `SELECT
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
WHERE storage_id = $1`, id); err != nil {
		return nil, err
	}
	if len(m) != 1 {
		return nil, fmt.Errorf("storage id not found: %s", id)
	}
	return m[0], nil
}

func (l *StorageLoaderImpl) StoragePaths(ctx context.Context) ([]*model.StoragePath, error) {
	var m []*model.StoragePath
	if err := l.loader.db.Select(ctx, &m, `SELECT
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

func (l *StorageLoaderImpl) StorageStats(ctx context.Context) ([]*model.StorageStats, error) {
	paths, err := l.StoragePaths(ctx)
	if err != nil {
		return nil, err
	}

	statsMap := make(map[model.StorageType]*model.StorageStats)
	countFor := func(group *model.StorageStats, path *model.StoragePath) {
		group.TotalAvailable += path.Available.Int64
		group.TotalCapacity += path.Capacity.Int64
		group.TotalFsAvailable += path.FsAvailable.Int64
		group.TotalUsed += path.Used.Int64
		group.TotalReserved += path.Reserved.Int64
	}

	for _, path := range paths {
		storageType := model.StorageTypeReadonly
		switch {
		case path.CanSeal.Bool && path.CanStore.Bool:
			storageType = model.StorageTypeHybrid
		case path.CanStore.Bool:
			storageType = model.StorageTypeStore
		case path.CanSeal.Bool:
			storageType = model.StorageTypeSeal
		}

		group, exists := statsMap[storageType]
		if !exists {
			group = &model.StorageStats{Type: storageType}
			statsMap[storageType] = group
		}

		countFor(group, path)
	}

	for _, st := range model.AllStorageType {
		if _, exists := statsMap[st]; !exists {
			statsMap[st] = &model.StorageStats{Type: st}
		}
	}

	// Convert the map to a slice
	var res []*model.StorageStats
	for _, group := range statsMap {
		res = append(res, group)
	}

	return res, nil
}

func (l *StorageLoaderImpl) StorageLiveness(ctx context.Context, id string) (*model.StorageLiveness, error) {
	var m []*model.StorageLiveness
	if err := l.loader.db.Select(ctx, &m, `SELECT
    storage_id,
    url,
    last_checked,
    last_live,
    last_dead,
    last_dead_reason
FROM
    sector_path_url_liveness
WHERE storage_id = $1`, id); err != nil {
		return nil, err
	}
	if len(m) != 1 {
		return nil, ErrorNotFound
	}
	return m[0], nil
}
