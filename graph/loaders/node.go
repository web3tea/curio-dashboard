package loaders

import (
	"context"
	"fmt"

	"github.com/strahe/curio-dashboard/graph/model"
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
                    WHEN last_contact > NOW() - INTERVAL '5 minutes' THEN 'online'
                    WHEN last_contact > NOW() - INTERVAL '15 minutes' THEN 'warning'
                    ELSE 'offline'
                END as status,
                unschedulable
            FROM harmony_machines
        )
        SELECT
            COUNT(CASE WHEN status = 'online' THEN 1 END) as online_count,
            COUNT(CASE WHEN status = 'warning' THEN 1 END) as warning_count,
            COUNT(CASE WHEN status = 'offline' THEN 1 END) as offline_count,
            COUNT(CASE WHEN unschedulable = true THEN 1 END) as unscheduled_count
        FROM node_status
    `

	var onlineCount, warningCount, offlineCount, unscheduledCount int
	err := l.loader.db.QueryRow(ctx, query).Scan(&onlineCount, &warningCount, &offlineCount, &unscheduledCount)
	if err != nil {
		return nil, fmt.Errorf("failed to query node health: %w", err)
	}

	totalNodes := onlineCount + warningCount + offlineCount
	var trend model.TrendType
	var onlinePercentage float64

	if totalNodes > 0 {
		onlinePercentage = float64(onlineCount) / float64(totalNodes) * 100
		unscheduledRatio := float64(unscheduledCount) / float64(totalNodes)

		switch {
		case onlinePercentage >= 90 && unscheduledRatio < 0.1:
			trend = model.TrendTypeUp
		case onlinePercentage >= 70 && unscheduledRatio < 0.2:
			trend = model.TrendTypeNormal
		case onlinePercentage >= 50:
			trend = model.TrendTypeWarning
		default:
			trend = model.TrendTypeDown
		}
	} else {
		trend = model.TrendTypeNormal
		onlinePercentage = 0
	}

	trendValue := fmt.Sprintf("%.1f%%", onlinePercentage)

	return &model.NodeHealthSummary{
		OnlineNodes:      onlineCount,
		WarningNodes:     warningCount,
		OfflineNodes:     offlineCount,
		UnscheduledNodes: unscheduledCount,
		Trend:            trend,
		TrendValue:       trendValue,
	}, nil
}
