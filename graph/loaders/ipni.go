package loaders

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/web3tea/curio-dashboard/graph/model"
)

type IPNILoader interface {
	IpniTotalAdvertisements(ctx context.Context) (int, error)
	IpniTotalProviders(ctx context.Context) (int, error)
	IpniTotalIndexed(ctx context.Context) (int, error)
	IpniTotalSkipped(ctx context.Context) (int, error)
	IpniPendingTasks(ctx context.Context) (int, error)
	IpniAdvertisementsCount(ctx context.Context, provider *string, isSkip, isRemoved *bool) (int, error)
	IpniAdvertisements(ctx context.Context, provider *string, isSkip, isRemoved *bool, offset int, limit int) ([]*model.IPNIAdvertisement, error)
	IpniAdvertisement(ctx context.Context, id int) (*model.IPNIAdvertisement, error)
	IpniPeerID(ctx context.Context, spID *int, peerID *string) (*model.IPNIPeerID, error)
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
	err = l.loader.db.QueryRow(ctx, `SELECT COUNT(*) FROM ipni_task`).Scan(&total)
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

func (l *IPNILoaderImpl) IpniAdvertisement(ctx context.Context, id int) (*model.IPNIAdvertisement, error) {
	var ads []*model.IPNIAdvertisement
	err := l.loader.db.Select(ctx, &ads, `
        SELECT
            ad_cid,
            context_id,
            is_rm,
            previous,
            provider,
            addresses,
            signature,
            entries,
            piece_cid,
            piece_size,
            is_skip
        FROM ipni
        WHERE order_number = $1
    `, id)
	if err != nil {
		return nil, err
	}

	if len(ads) == 0 {
		return nil, ErrorNotFound
	}

	return ads[0], nil
}

func (l *IPNILoaderImpl) IpniAdvertisements(ctx context.Context, provider *string, isSkip, isRemoved *bool, offset int, limit int) ([]*model.IPNIAdvertisement, error) {
	var ads []*model.IPNIAdvertisement
	err := l.loader.db.Select(ctx, &ads, `
								SELECT
									order_number,
									ad_cid,
									context_id,
									is_rm,
									previous,
									provider,
									addresses,
									signature,
									entries,
									piece_cid,
									piece_size,
									is_skip
								FROM ipni
								WHERE ($1::text IS NULL OR provider = $1)
								AND ($2::boolean IS NULL OR is_skip = $2)
								AND ($3::boolean IS NULL OR is_rm = $3)
								ORDER BY order_number ASC
								LIMIT $4 OFFSET $5
				`, provider, isSkip, isRemoved, limit, offset)
	if err != nil {
		return nil, err
	}

	return ads, nil
}

func (l *IPNILoaderImpl) IpniAdvertisementsCount(ctx context.Context, provider *string, isSkip, isRemoved *bool) (int, error) {
	var count int
	err := l.loader.db.QueryRow(ctx, `
								SELECT
												COUNT(*)
								FROM ipni
								WHERE ($1 = '' OR provider = $1)
								AND ($2::boolean IS NULL OR is_skip = $2)
								AND ($3::boolean IS NULL OR is_rm = $3)
				`, provider, isSkip, isRemoved).Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (l *IPNILoaderImpl) IpniPeerID(ctx context.Context, spID *int, peerID *string) (*model.IPNIPeerID, error) {
	if spID == nil && peerID == nil {
		return nil, fmt.Errorf("spid or peerid is required")
	}

	var pi model.IPNIPeerID
	err := l.loader.db.QueryRow(ctx, `
								SELECT
									peer_id,
									sp_id
								FROM ipni_peerid
								WHERE ($1::int IS NULL OR sp_id = $1)
										AND ($2::text IS NULL OR peer_id = $2)
				`, spID, peerID).Scan(&pi.PeerID, &pi.SpID)
	if err != nil {
		return nil, err
	}

	return &pi, nil
}
