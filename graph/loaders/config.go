package loaders

import (
	"context"
	"strings"

	"github.com/strahe/curio-dashboard/graph/model"
)

type ConfigLoader interface {
	Config(ctx context.Context, layer string) (*model.Config, error)
	Configs(ctx context.Context) ([]*model.Config, error)
	ConfigUsed(ctx context.Context, layer string) ([]*model.MachineDetail, error)
}

func (l *Loader) Config(ctx context.Context, layer string) (*model.Config, error) {
	var m model.Config
	err := l.db.QueryRow(ctx, "SELECT id,title,config FROM harmony_config WHERE title = $1", layer).
		Scan(&m.ID, &m.Title, &m.Config)
	return &m, err
}

// Configs is the resolver for the configs field.
func (l *Loader) Configs(ctx context.Context) ([]*model.Config, error) {
	var m []*model.Config
	if err := l.db.Select(ctx, &m, "SELECT * FROM harmony_config"); err != nil {
		return nil, err
	}
	return m, nil
}

func (l *Loader) configUsedMap(ctx context.Context) (map[string][]*model.MachineDetail, error) {
	cacheKey := "configUsedMap"
	m, ok := l.cache.Get(cacheKey)
	if ok {
		return m.(map[string][]*model.MachineDetail), nil
	}

	mds, err := l.MachineDetails(ctx)
	if err != nil {
		return nil, err
	}
	confMap := make(map[string][]*model.MachineDetail)
	for _, md := range mds {
		layers := strings.Split(md.Layers, ",")
		for _, layer := range layers {
			confMap[layer] = append(confMap[layer], md)
		}
	}

	l.cache.Add(cacheKey, confMap)

	return confMap, nil
}

func (l *Loader) ConfigUsed(ctx context.Context, layer string) ([]*model.MachineDetail, error) {
	confMap, err := l.configUsedMap(ctx)
	if err != nil {
		return nil, err
	}

	mds, ok := confMap[layer]
	if !ok {
		return nil, nil
	}

	return mds, nil
}
