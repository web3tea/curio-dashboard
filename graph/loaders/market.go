package loaders

import (
	"context"
	"fmt"

	"github.com/filecoin-project/curio/web/api/webrpc"
	"github.com/strahe/curio-dashboard/graph/model"
)

type MarketLoader interface {
	MarketMk12StorageAsks(ctx context.Context) ([]*model.MarketMk12StorageAsk, error)
	MarketMk12StorageAsk(ctx context.Context, spID uint64) (*model.MarketMk12StorageAsk, error)
	MarketMk12StorageAsksCount(ctx context.Context) (int, error)
	MarketMk12PriceFilter(ctx context.Context, name string) (*webrpc.PriceFilter, error)
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

func (l *MarketLoaderImpl) MarketMk12PriceFilter(ctx context.Context, name string) (*webrpc.PriceFilter, error) {
	var res []*webrpc.PriceFilter
	err := l.loader.db.Select(ctx, &res, `
	SELECT
		name,
		min_duration_days,
		max_duration_days,
		min_size,
		max_size,
		price,
		verified
	FROM market_mk12_price_filter
	WHERE name = $1`, name)
	if err != nil {
		return nil, err
	}
	if len(res) == 0 {
		return nil, fmt.Errorf("price filter not found")
	}
	return res[0], nil
}
