package loaders

import (
	"context"

	"github.com/web3tea/curio-dashboard/types"

	"github.com/web3tea/curio-dashboard/graph/model"
)

type PorepLoader interface {
	Porep(ctx context.Context, sp types.Address, sectorNumber int) (*model.Porep, error)
	Poreps(ctx context.Context) ([]*model.Porep, error)
	PipelinesSummary(ctx context.Context) ([]*model.PipelineSummary, error)
}

type PorepLoaderImpl struct {
	loader *Loader
}

func NewPorepLoader(loader *Loader) PorepLoader {
	return &PorepLoaderImpl{loader}
}

func (l *PorepLoaderImpl) Porep(ctx context.Context, sp types.Address, sectorNumber int) (*model.Porep, error) {
	var ms []*model.Porep
	if err := l.loader.db.Select(ctx, &ms, `SELECT
    sp_id,
    sector_number,
    create_time,
    reg_seal_proof,
    ticket_epoch,
    ticket_value,
    task_id_sdr,
    after_sdr,
    tree_d_cid,
    task_id_tree_d,
    after_tree_d,
    task_id_tree_c,
    after_tree_c,
    tree_r_cid,
    task_id_tree_r,
    after_tree_r,
    precommit_msg_cid,
    task_id_precommit_msg,
    after_precommit_msg,
    seed_epoch,
    precommit_msg_tsk,
    after_precommit_msg_success,
    seed_value,
    task_id_porep,
    porep_proof,
    after_porep,
    task_id_finalize,
    after_finalize,
    task_id_move_storage,
    after_move_storage,
    commit_msg_cid,
    task_id_commit_msg,
    after_commit_msg,
    commit_msg_tsk,
    after_commit_msg_success,
    failed,
    failed_at,
    failed_reason,
    failed_reason_msg,
    task_id_synth,
    after_synth,
    user_sector_duration_epochs
FROM
    sectors_sdr_pipeline
WHERE sp_id = $1 AND sector_number = $2
Order By create_time`, sp.ID, sectorNumber); err != nil {
		return nil, err
	}
	if len(ms) == 0 {
		return nil, ErrorNotFound
	}
	return ms[0], nil
}

func (l *PorepLoaderImpl) Poreps(ctx context.Context) ([]*model.Porep, error) {
	var ms []*model.Porep
	if err := l.loader.db.Select(ctx, &ms, `SELECT
    sp_id,
    sector_number,
    create_time,
    reg_seal_proof,
    ticket_epoch,
    ticket_value,
    task_id_sdr,
    after_sdr,
    tree_d_cid,
    task_id_tree_d,
    after_tree_d,
    task_id_tree_c,
    after_tree_c,
    tree_r_cid,
    task_id_tree_r,
    after_tree_r,
    precommit_msg_cid,
    task_id_precommit_msg,
    after_precommit_msg,
    seed_epoch,
    precommit_msg_tsk,
    after_precommit_msg_success,
    seed_value,
    task_id_porep,
    porep_proof,
    after_porep,
    task_id_finalize,
    after_finalize,
    task_id_move_storage,
    after_move_storage,
    commit_msg_cid,
    task_id_commit_msg,
    after_commit_msg,
    commit_msg_tsk,
    after_commit_msg_success,
    failed,
    failed_at,
    failed_reason,
    failed_reason_msg,
    task_id_synth,
    after_synth,
    user_sector_duration_epochs
FROM
    sectors_sdr_pipeline
Order By create_time`); err != nil {
		return nil, err
	}
	return ms, nil
}

func (l *PorepLoaderImpl) PipelinesSummary(ctx context.Context) ([]*model.PipelineSummary, error) {
	var ms []*model.PipelineSummary
	err := l.loader.db.Select(ctx, &ms, "SELECT DISTINCT sp_id FROM sectors_sdr_pipeline")
	return ms, err
}
