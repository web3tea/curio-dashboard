package loaders

import (
	"context"

	"github.com/web3tea/curio-dashboard/graph/model"
	"github.com/web3tea/curio-dashboard/types"
)

type WdPostLoader interface {
	WdpostProofs(ctx context.Context, spID *types.Address, offset int, limit int) ([]*model.WdpostProofs, error)
	WdpostProofsCount(ctx context.Context, spID *types.Address) (int, error)
	WdpostProof(ctx context.Context, spID types.Address, provingPeriodStart int, deadline int, partition int) (*model.WdpostProofs, error)
}

type WdPostLoaderImpl struct {
	loader *Loader
}

func NewWdPostLoader(loader *Loader) *WdPostLoaderImpl {
	return &WdPostLoaderImpl{loader}
}

func (l *WdPostLoaderImpl) WdpostProofsCount(ctx context.Context, spID *types.Address) (int, error) {
	var result int
	err := l.loader.db.QueryRow(ctx, `
SELECT
    COUNT(*)
FROM
    wdpost_proofs
WHERE
    ($1::bigint IS NULL OR sp_id = $1)`, spID.ID()).Scan(&result)
	return result, err
}

func (l *WdPostLoaderImpl) WdpostProofs(ctx context.Context, spID *types.Address, offset int, limit int) ([]*model.WdpostProofs, error) {
	var result []*model.WdpostProofs

	err := l.loader.db.Select(ctx, &result, `
SELECT
    sp_id,
    proving_period_start,
    deadline,
    partition,
    submit_at_epoch,
    submit_by_epoch,
    proof_params,
    submit_task_id,
    message_cid,
    test_task_id
FROM
    wdpost_proofs
WHERE
    ($1::bigint IS NULL OR sp_id = $1)
ORDER BY
    proving_period_start DESC, deadline ASC, partition ASC
LIMIT $2 OFFSET $3`, spID.ID(), limit, offset)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (l *WdPostLoaderImpl) WdpostProof(ctx context.Context, spID types.Address, provingPeriodStart int, deadline int, partition int) (*model.WdpostProofs, error) {
	var result model.WdpostProofs

	err := l.loader.db.QueryRow(ctx, `
SELECT
    sp_id,
    proving_period_start,
    deadline,
    partition,
    submit_at_epoch,
    submit_by_epoch,
    proof_params,
    submit_task_id,
    message_cid,
    test_task_id
FROM
    wdpost_proofs
WHERE
    sp_id = $1 AND proving_period_start = $2 AND deadline = $3 AND partition = $4`,
		spID.ID, provingPeriodStart, deadline, partition).Scan(
		&result.SpID,
		&result.ProvingPeriodStart,
		&result.Deadline,
		&result.Partition,
		&result.SubmitAtEpoch,
		&result.SubmitByEpoch,
		&result.ProofParams,
		&result.SubmitTaskID,
		&result.MessageCid,
		&result.TestTaskID,
	)
	if err != nil {
		return nil, err
	}
	return &result, nil
}
