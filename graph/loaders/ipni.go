package loaders

import (
	"context"
	"sync"
	"time"
)

type IPNILoader interface {
	IpniTotalAdvertisements(ctx context.Context) (int, error)
	IpniTotalProviders(ctx context.Context) (int, error)
	IpniTotalIndexed(ctx context.Context) (int, error)
	IpniTotalSkipped(ctx context.Context) (int, error)
	IpniPendingTasks(ctx context.Context) (int, error)
}

type IPNILoaderImpl struct {
	loader *Loader
	mu     sync.Mutex
}

func NewIPNILoader(loader *Loader) IPNILoader {
	return &IPNILoaderImpl{
		loader: loader,
	}
}

func (l *IPNILoaderImpl) IpniTotalAdvertisements(ctx context.Context) (total int, err error) {
	err = l.loader.db.QueryRow(ctx, `SELECT COUNT(*) FROM ipni`).Scan(&total)
	return total, err
}

func (l *IPNILoaderImpl) IpniTotalProviders(ctx context.Context) (total int, err error) {
	err = l.loader.db.QueryRow(ctx, `SELECT COUNT(*) FROM ipni_head`).Scan(&total)
	return total, err
}

func (l *IPNILoaderImpl) IpniTotalIndexed(ctx context.Context) (total int, err error) {
	stats, err := l.getIndexStats(ctx)
	if err != nil {
		return 0, err
	}
	return stats.Indexed, nil
}

func (l *IPNILoaderImpl) IpniTotalSkipped(ctx context.Context) (total int, err error) {
	stats, err := l.getIndexStats(ctx)
	if err != nil {
		return 0, err
	}
	return stats.Skipped, nil
}

func (l *IPNILoaderImpl) IpniPendingTasks(ctx context.Context) (total int, err error) {
	err = l.loader.db.QueryRow(ctx, `SELECT COUNT(*) FROM ipni_pending`).Scan(&total)
	return total, err
}

type indexStats struct {
	Indexed int
	Skipped int
}

func (l *IPNILoaderImpl) getIndexStats(ctx context.Context) (*indexStats, error) {
	l.mu.Lock()
	defer l.mu.Unlock()
	const cacheKey = "ipni_index_stats"

	item := l.loader.cache.Get(cacheKey)
	if item != nil && !item.IsExpired() {
		is := item.Value().(*indexStats)
		return is, nil
	}

	stats := &indexStats{}
	err := l.loader.db.QueryRow(ctx, `
        SELECT
            COALESCE(SUM(CASE WHEN is_skip = false THEN 1 ELSE 0 END), 0) AS indexed,
            COALESCE(SUM(CASE WHEN is_skip = true THEN 1 ELSE 0 END), 0) AS skipped
        FROM ipni
    `).Scan(&stats.Indexed, &stats.Skipped)
	if err != nil {
		return nil, err
	}

	l.loader.cache.Set(cacheKey, stats, time.Hour)

	return stats, nil
}
