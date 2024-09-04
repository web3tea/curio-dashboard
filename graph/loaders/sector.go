package loaders

import (
	"context"
	"fmt"

	"github.com/strahe/curio-dashboard/types"

	"github.com/strahe/curio-dashboard/graph/model"
)

type SectorLoader interface {
	SectorMetas(ctx context.Context, actor *types.ActorID, offset int, limit int) ([]*model.SectorMeta, error)
	SectorMeta(ctx context.Context, actor types.ActorID, sectorNumber int) (*model.SectorMeta, error)
	SectorsCount(ctx context.Context, actor *types.ActorID) (int, error)
	SectorLocations(ctx context.Context, actor types.ActorID, sectorNumber int) ([]*model.SectorLocation, error)
	SectorPieces(ctx context.Context, actor types.ActorID, sectorNumber int) ([]*model.SectorMetaPiece, error)
	SectorEvents(ctx context.Context, actor types.ActorID, sectorNumber int) ([]*model.TaskHistory, error)
}

var _ SectorLoader = &Loader{}

func (l *Loader) SectorMetas(ctx context.Context, actor *types.ActorID, offset int, limit int) ([]*model.SectorMeta, error) {
	var m []*model.SectorMeta
	if actor == nil {
		if err := l.db.Select(ctx, &m, `SELECT
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
LIMIT $1 OFFSET $2`, limit, offset); err != nil {
			return nil, err
		}
	} else {
		if err := l.db.Select(ctx, &m, `SELECT
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
WHERE sp_id = $1 LIMIT $2 OFFSET $3`, *actor, limit, offset); err != nil {
			return nil, err
		}
	}
	return m, nil
}

func (l *Loader) SectorMeta(ctx context.Context, actor types.ActorID, sectorNumber int) (*model.SectorMeta, error) {
	var mm []*model.SectorMeta
	err := l.db.Select(ctx, &mm, `SELECT 
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
		actor, sectorNumber)
	if err != nil {
		return nil, err
	}
	if len(mm) == 0 {
		return nil, fmt.Errorf("sector meta not found")
	}
	return mm[0], nil
}

func (l *Loader) SectorsCount(ctx context.Context, actor *types.ActorID) (int, error) {
	if actor == nil {
		var count int
		if err := l.db.QueryRow(ctx, "SELECT COUNT(*) FROM sectors_meta").Scan(&count); err != nil {
			return 0, err
		}
		return count, nil
	}
	var count int
	if err := l.db.QueryRow(ctx, "SELECT COUNT(*) FROM sectors_meta WHERE sp_id = $1", *actor).Scan(&count); err != nil {
		return 0, err
	}
	return count, nil
}

func (l *Loader) SectorLocations(ctx context.Context, actor types.ActorID, sectorNumber int) ([]*model.SectorLocation, error) {
	var locations []*model.SectorLocation
	if err := l.db.Select(ctx, &locations, `SELECT
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
WHERE miner_id = $1 AND sector_num = $2`, actor, sectorNumber); err != nil {
		return nil, err
	}
	return locations, nil
}

func (l *Loader) SectorPieces(ctx context.Context, actor types.ActorID, sectorNumber int) ([]*model.SectorMetaPiece, error) {
	var pieces []*model.SectorMetaPiece
	if err := l.db.Select(ctx, &pieces, `SELECT
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
WHERE sp_id = $1 AND sector_num = $2`, actor, sectorNumber); err != nil {
		return nil, err
	}
	return pieces, nil
}

func (l *Loader) SectorEvents(ctx context.Context, actor types.ActorID, sectorNumber int) ([]*model.TaskHistory, error) {
	var events []*model.TaskHistory

	err := l.db.Select(ctx, &events, `SELECT h.*
				FROM harmony_task_history h
         			JOIN sectors_pipeline_events s ON h.id = s.task_history_id
				WHERE s.sp_id = $1 AND s.sector_number = $2 ORDER BY h.work_end DESC;`, actor, sectorNumber)

	if err != nil {
		return nil, err
	}

	return events, nil
}
