package loaders

import (
	"context"
	"fmt"

	"github.com/samber/lo"
	"github.com/strahe/curio-dashboard/types"
	"golang.org/x/xerrors"

	"github.com/strahe/curio-dashboard/graph/model"
)

type SectorLoader interface {
	SectorMetas(ctx context.Context, actor *types.Address, offset int, limit int) ([]*model.SectorMeta, error)
	SectorMeta(ctx context.Context, actor types.Address, sectorNumber int) (*model.SectorMeta, error)
	SectorsCount(ctx context.Context, actor *types.Address) (int, error)
	SectorLocations(ctx context.Context, actor types.Address, sectorNumber int) ([]*model.SectorLocation, error)
	SectorPieces(ctx context.Context, actor types.Address, sectorNumber int) ([]*model.SectorMetaPiece, error)
	SectorEvents(ctx context.Context, actor types.Address, sectorNumber int) ([]*model.TaskHistory, error)
	SectorTasks(ctx context.Context, actor types.Address, sectorNumber int) ([]*model.Task, error)
	OpenSectorPieces(ctx context.Context) ([]*model.OpenSectorPiece, error)
	SectorSummary(ctx context.Context) (*model.SectorSummary, error)
}

type SectorLoaderImpl struct {
	loader *Loader
}

func NewSectorLoader(loader *Loader) SectorLoader {
	return &SectorLoaderImpl{loader}
}

func (l *SectorLoaderImpl) SectorTasks(ctx context.Context, actor types.Address, sectorNumber int) ([]*model.Task, error) {
	var tasks []*model.Task
	if err := l.loader.db.Select(ctx, &tasks, `
WITH task_ids AS (
    SELECT unnest(get_sdr_pipeline_tasks($1, $2)) AS task_id
)
SELECT ht.id, ht.name, ht.posted_time, ht.update_time, ht.initiated_by, ht.owner_id, ht.previous_task, ht.added_by
FROM task_ids
INNER JOIN harmony_task ht ON ht.id = task_id;
`, actor.ID, sectorNumber); err != nil {
		return nil, err
	}
	return tasks, nil
}

func (l *SectorLoaderImpl) SectorMetas(ctx context.Context, actor *types.Address, offset int, limit int) ([]*model.SectorMeta, error) {
	var m []*model.SectorMeta
	if err := l.loader.db.Select(ctx, &m, `SELECT
				sp_id,
				sector_num,
				reg_seal_proof,
				ticket_epoch,
				ticket_value,
				orig_sealed_cid,
				orig_unsealed_cid,
				cur_sealed_cid,
				cur_unsealed_cid,
				msg_cid_precommit,
				msg_cid_commit,
				msg_cid_update,
				seed_epoch,
				seed_value,
				expiration_epoch,
				is_cc,
				deadline,
				partition
FROM
				sectors_meta
WHERE ($1::bigint IS NULL OR sp_id = $1)
LIMIT $2 OFFSET $3`, lo.If[*uint64](actor == nil, nil).Else(&actor.ID), limit, offset); err != nil {
		return nil, err
	}
	return m, nil
}

func (l *SectorLoaderImpl) SectorMeta(ctx context.Context, actor types.Address, sectorNumber int) (*model.SectorMeta, error) {
	var mm []*model.SectorMeta
	err := l.loader.db.Select(ctx, &mm, `SELECT
    sp_id,
    sector_num,
    reg_seal_proof,
    ticket_epoch,
    ticket_value,
    orig_sealed_cid,
    orig_unsealed_cid,
    cur_sealed_cid,
    cur_unsealed_cid,
    msg_cid_precommit,
    msg_cid_commit,
    msg_cid_update,
    seed_epoch,
    seed_value
FROM sectors_meta
WHERE sp_id = $1
  AND sector_num = $2`,
		actor.ID, sectorNumber)
	if err != nil {
		return nil, err
	}
	if len(mm) == 0 {
		return nil, ErrorNotFound
	}
	return mm[0], nil
}

func (l *SectorLoaderImpl) SectorsCount(ctx context.Context, actor *types.Address) (int, error) {
	var count int
	err := l.loader.db.QueryRow(ctx, `SELECT COUNT(*)
FROM sectors_meta
WHERE ($1::bigint IS NULL OR sp_id = $1)`, lo.If[*uint64](actor == nil, nil).Else(&actor.ID)).Scan(&count)
	if err != nil {
		return 0, xerrors.Errorf("counting sectors: %w", err)
	}
	return count, nil
}

func (l *SectorLoaderImpl) SectorLocations(ctx context.Context, actor types.Address, sectorNumber int) ([]*model.SectorLocation, error) {
	var locations []*model.SectorLocation
	if err := l.loader.db.Select(ctx, &locations, `SELECT
    miner_id,
    sector_num,
    sector_filetype,
    storage_id,
    is_primary,
    read_ts,
    read_refs,
    write_ts,
    write_lock_owner
FROM
    sector_location
WHERE miner_id = $1 AND sector_num = $2`, actor.ID, sectorNumber); err != nil {
		return nil, err
	}
	return locations, nil
}

func (l *SectorLoaderImpl) SectorPieces(ctx context.Context, actor types.Address, sectorNumber int) ([]*model.SectorMetaPiece, error) {
	var pieces []*model.SectorMetaPiece
	if err := l.loader.db.Select(ctx, &pieces, `SELECT
    sp_id,
    sector_num,
    piece_num,
    piece_cid,
    piece_size,
    requested_keep_data,
    raw_data_size,
    start_epoch,
    orig_end_epoch,
    f05_deal_id,
    ddo_pam,
    f05_deal_proposal
FROM
    sectors_meta_pieces
WHERE sp_id = $1 AND sector_num = $2`, actor.ID, sectorNumber); err != nil {
		return nil, err
	}
	return pieces, nil
}

func (l *SectorLoaderImpl) SectorEvents(ctx context.Context, actor types.Address, sectorNumber int) ([]*model.TaskHistory, error) {
	var events []*model.TaskHistory

	err := l.loader.db.Select(ctx, &events, `SELECT h.*
				FROM harmony_task_history h
         			JOIN sectors_pipeline_events s ON h.id = s.task_history_id
				WHERE s.sp_id = $1 AND s.sector_number = $2 ORDER BY h.work_end DESC;`, actor.ID, sectorNumber)
	if err != nil {
		return nil, err
	}

	return events, nil
}

func (l *SectorLoaderImpl) OpenSectorPieces(ctx context.Context) ([]*model.OpenSectorPiece, error) {
	var deals []*model.OpenSectorPiece
	err := l.loader.db.Select(ctx, &deals, `SELECT
    sp_id,
    sector_number,
    piece_index,
    piece_cid,
    piece_size,
    data_url,
    data_headers,
    data_raw_size,
    data_delete_on_finalize,
    f05_publish_cid,
    f05_deal_id,
    f05_deal_proposal,
    f05_deal_start_epoch,
    f05_deal_end_epoch,
    direct_start_epoch,
    direct_end_epoch,
    direct_piece_activation_manifest,
    created_at,
    is_snap
FROM
    open_sector_pieces
ORDER BY
    created_at DESC`)
	if err != nil {
		return nil, err
	}
	return deals, nil
}

func (l *SectorLoaderImpl) SectorSummary(ctx context.Context) (*model.SectorSummary, error) {
	summary := &model.SectorSummary{
		Active:  0,
		Sealing: 0,
		Failed:  0,
	}
	err := l.loader.db.QueryRow(ctx, `
        SELECT COUNT(*) FROM curio.sectors_meta`).Scan(&summary.Active)
	if err != nil {
		return nil, fmt.Errorf("failed to get active sectors count: %w", err)
	}

	var sdrSealing, sdrFailed int
	err = l.loader.db.QueryRow(ctx, `
        SELECT
            COUNT(*) FILTER (WHERE failed = false) as sealing,
            COUNT(*) FILTER (WHERE failed = true) as failed
        FROM curio.sectors_sdr_pipeline
    `).Scan(&sdrSealing, &sdrFailed)
	if err != nil {
		return nil, fmt.Errorf("failed to get SDR pipeline counts: %w", err)
	}

	var snapSealing, snapFailed int
	err = l.loader.db.QueryRow(ctx, `
        SELECT
            COUNT(*) FILTER (WHERE failed = false) as sealing,
            COUNT(*) FILTER (WHERE failed = true) as failed
        FROM curio.sectors_snap_pipeline
    `).Scan(&snapSealing, &snapFailed)
	if err != nil {
		return nil, fmt.Errorf("failed to get SNAP pipeline counts: %w", err)
	}

	summary.Sealing = sdrSealing + snapSealing
	summary.Failed = sdrFailed + snapFailed
	return summary, nil
}
