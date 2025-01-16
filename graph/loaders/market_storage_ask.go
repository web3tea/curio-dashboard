package loaders

import (
	"context"

	"github.com/strahe/curio-dashboard/db"
	"github.com/strahe/curio-dashboard/graph/model"
)

type MarketStorageAskLoader interface {
	MarketMk12StorageAsks(ctx context.Context) ([]*model.MarketMk12StorageAsk, error)
	MarketMk12StorageAsk(ctx context.Context, spID int64) (*model.MarketMk12StorageAsk, error)
	MarketMk12StorageAsksCount(ctx context.Context) (int, error)
}

type MarketStorageAskLoaderImpl struct {
	db *db.HarmonyDB
}

func NewMarketStorageAskLoader(db *db.HarmonyDB) MarketStorageAskLoader {
	return &MarketStorageAskLoaderImpl{db: db}
}

func (l *MarketStorageAskLoaderImpl) MarketMk12StorageAsks(ctx context.Context) ([]*model.MarketMk12StorageAsk, error) {
	var result []*model.MarketMk12StorageAsk

	err := l.db.Select(ctx, &result, `SELECT
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

func (l *MarketStorageAskLoaderImpl) MarketMk12StorageAsk(ctx context.Context, spID int64) (*model.MarketMk12StorageAsk, error) {
	var result model.MarketMk12StorageAsk

	err := l.db.QueryRow(ctx, `SELECT
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

func (l *MarketStorageAskLoaderImpl) MarketMk12StorageAsksCount(ctx context.Context) (int, error) {
	var result int
	err := l.db.QueryRow(ctx, `SELECT COUNT(*) FROM market_mk12_storage_ask`).Scan(&result)
	return result, err
}
