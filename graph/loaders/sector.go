package loaders

import (
	"context"

	"github.com/strahe/curio-dashboard/types"

	"github.com/strahe/curio-dashboard/graph/model"
)

func (l *Loader) Sectors(ctx context.Context, actor *types.ActorID, offset int, limit int) ([]*model.Sector, error) {
	var m []*model.SectorMeta
	if actor == nil {
		if err := l.db.Select(ctx, &m, `SELECT * FROM sectors_meta LIMIT $1 OFFSET $2`, limit, offset); err != nil {
			return nil, err
		}
	} else {
		if err := l.db.Select(ctx, &m, `SELECT * FROM sectors_meta WHERE sp_id = $1 LIMIT $2 OFFSET $3`, *actor, limit, offset); err != nil {
			return nil, err
		}
	}

	var out []*model.Sector
	for _, meta := range m {
		out = append(out, &model.Sector{
			SpID:      meta.SpID,
			SectorNum: meta.SectorNum,
			Meta:      meta,
		})
	}
	return out, nil
}

func (l *Loader) Sector(ctx context.Context, actor types.ActorID, sectorNumber int) (*model.Sector, error) {
	var m model.SectorMeta
	err := l.db.QueryRow(ctx, `SELECT sp_id, sector_num, reg_seal_proof, ticket_epoch, ticket_value, orig_sealed_cid, orig_unsealed_cid, cur_sealed_cid, cur_unsealed_cid, msg_cid_precommit, msg_cid_commit, msg_cid_update, seed_epoch, seed_value FROM sectors_meta WHERE sp_id = $1 AND sector_num = $2`, actor, sectorNumber).
		Scan(&m.SpID, &m.SectorNum, &m.RegSealProof, &m.TicketEpoch, &m.TicketValue, &m.OrigSealedCid, &m.OrigUnsealedCid, &m.CurSealedCid, &m.CurUnsealedCid, &m.MsgCidPrecommit, &m.MsgCidCommit, &m.MsgCidUpdate, &m.SeedEpoch, &m.SeedValue)
	if err != nil {
		return nil, err
	}
	return &model.Sector{
		SpID:      m.SpID,
		SectorNum: m.SectorNum,
		Meta:      &m,
	}, nil
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
	if err := l.db.Select(ctx, &locations, `SELECT * FROM sector_location WHERE miner_id = $1 AND sector_num = $2`, actor, sectorNumber); err != nil {
		return nil, err
	}
	return locations, nil
}

func (l *Loader) SectorPieces(ctx context.Context, actor types.ActorID, sectorNumber int) ([]*model.SectorMetaPiece, error) {
	var pieces []*model.SectorMetaPiece
	if err := l.db.Select(ctx, &pieces, `SELECT * FROM sectors_meta_pieces WHERE sp_id = $1 AND sector_num = $2`, actor, sectorNumber); err != nil {
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
