package loaders

import (
	"context"

	"github.com/strahe/curio-dashboard/graph/model"
)

func (l *Loader) OpenSectorPieces(ctx context.Context) ([]*model.OpenSectorPiece, error) {

	var deals []*model.OpenSectorPiece
	err := l.db.Select(ctx, &deals, `SELECT
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
