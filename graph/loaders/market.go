package loaders

import (
	"context"

	"github.com/strahe/curio-dashboard/graph/model"
)

type MarketLoader interface {
	MarketMk12StorageAsks(ctx context.Context) ([]*model.MarketMk12StorageAsk, error)
	MarketMk12StorageAsk(ctx context.Context, spID uint64) (*model.MarketMk12StorageAsk, error)
	MarketMk12StorageAsksCount(ctx context.Context) (int, error)
}

type MarketLoaderImpl struct {
	loader *Loader
}

func NewMarketLoader(loader *Loader) MarketLoader {
	return &MarketLoaderImpl{loader}
}

func (l *MarketLoaderImpl) MarketMk12StorageAsks(ctx context.Context) ([]*model.MarketMk12StorageAsk, error) {
	var result []*model.MarketMk12StorageAsk

	err := l.loader.db.Select(ctx, &result, `SELECT
		sp_id,
		price,
		verified_price,
		min_size,
		max_size,
		created_at,
		expiry,
		sequence
		FROM market_mk12_storage_ask`)
	return result, err
}

func (l *MarketLoaderImpl) MarketMk12StorageAsk(ctx context.Context, spID uint64) (*model.MarketMk12StorageAsk, error) {
	var result model.MarketMk12StorageAsk

	err := l.loader.db.QueryRow(ctx, `SELECT
		sp_id,
		price,
		verified_price,
		min_size,
		max_size,
		created_at,
		expiry,
		sequence
		FROM market_mk12_storage_ask
		WHERE sp_id = $1`, spID).Scan(
		&result.SpID,
		&result.Price,
		&result.VerifiedPrice,
		&result.MinSize,
		&result.MaxSize,
		&result.CreatedAt,
		&result.Expiry,
		&result.Sequence,
	)
	return &result, err
}

func (l *MarketLoaderImpl) MarketMk12StorageAsksCount(ctx context.Context) (int, error) {
	var result int
	err := l.loader.db.QueryRow(ctx, `SELECT COUNT(*) FROM market_mk12_storage_ask`).Scan(&result)
	return result, err
}
