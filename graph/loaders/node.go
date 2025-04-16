package loaders

import (
	"context"
	"fmt"

	"github.com/web3tea/curio-dashboard/graph/model"
)

type NodeLoader interface {
	NodeHealthSummary(ctx context.Context) (*model.NodeHealthSummary, error)
}

type NodeLoaderImpl struct {
	loader *Loader
}

func NewNodeLoader(loader *Loader) *NodeLoaderImpl {
	return &NodeLoaderImpl{loader}
}

func (l *NodeLoaderImpl) NodeHealthSummary(ctx context.Context) (*model.NodeHealthSummary, error) {
	query := `
        WITH node_status AS (
            SELECT
                CASE
                    WHEN last_contact > NOW() - INTERVAL '2 minutes' THEN 'online'
                    ELSE 'offline'
                END as status,
                unschedulable
            FROM harmony_machines
        )
        SELECT
            COUNT(CASE WHEN status = 'online' THEN 1 END) as online_count,
            COUNT(CASE WHEN status = 'offline' THEN 1 END) as offline_count,
            COUNT(CASE WHEN unschedulable = true THEN 1 END) as unscheduled_count
        FROM node_status
    `

	var onlineCount, offlineCount, unscheduledCount int
	err := l.loader.db.QueryRow(ctx, query).Scan(&onlineCount, &offlineCount, &unscheduledCount)
	if err != nil {
		return nil, fmt.Errorf("failed to query node health: %w", err)
	}
	return &model.NodeHealthSummary{
		OnlineNodes:      onlineCount,
		OfflineNodes:     offlineCount,
		UnscheduledNodes: unscheduledCount,
	}, nil
}
