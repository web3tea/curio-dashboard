package loaders

import (
	"context"

	"github.com/filecoin-project/curio/web/api/webrpc"
	"github.com/strahe/curio-dashboard/graph/model"
	"github.com/strahe/curio-dashboard/types"
)

type MarketLoader interface {
	MarketMk12StorageAsks(ctx context.Context) ([]*model.MarketMk12StorageAsk, error)
	MarketMk12StorageAsk(ctx context.Context, spID uint64) (*model.MarketMk12StorageAsk, error)
	MarketMk12StorageAsksCount(ctx context.Context) (int, error)
	MarketMk12PriceFilter(ctx context.Context, name string) (*webrpc.PriceFilter, error)
	MarketMk12ClientFilter(ctx context.Context, name string) (*webrpc.ClientFilter, error)
	MarketAllowFilter(ctx context.Context, wallet types.Address) (*model.MarketAllowFilter, error)
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
	FROM market_mk12_pricing_filters
	WHERE name = $1`, name)
	if err != nil {
		return nil, err
	}
	if len(res) == 0 {
		return nil, ErrorNotFound
	}
	return res[0], nil
}

func (l *MarketLoaderImpl) MarketMk12ClientFilter(ctx context.Context, name string) (*webrpc.ClientFilter, error) {
	var res []*webrpc.ClientFilter
	err := l.loader.db.Select(ctx, &res, `
	SELECT
		name,
		active,
		wallets,
		peer_ids,
		pricing_filters,
		max_deals_per_hour,
		max_deal_size_per_hour,
		additional_info
	FROM market_mk12_client_filters
	WHERE name = $1`, name)
	if err != nil {
		return nil, err
	}
	if len(res) == 0 {
		return nil, ErrorNotFound
	}
	return res[0], nil
}

func (l *MarketLoaderImpl) MarketAllowFilter(ctx context.Context, wallet types.Address) (*model.MarketAllowFilter, error) {
	var res []*model.MarketAllowFilter
	err := l.loader.db.Select(ctx, &res, `
	SELECT
		wallet,
		status
	FROM market_allow_list
	WHERE wallet = $1`, wallet)
	if err != nil {
		return nil, err
	}
	if len(res) == 0 {
		return nil, ErrorNotFound
	}
	return res[0], nil
}
