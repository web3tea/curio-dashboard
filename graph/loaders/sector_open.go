package loaders

import (
	"context"

	"github.com/strahe/curio-dashboard/graph/model"
)

func (l *Loader) OpenSectorPieces(ctx context.Context) ([]*model.OpenSectorPiece, error) {

	var deals []*model.OpenSectorPiece
	err := l.db.Select(ctx, &deals, `SELECT * FROM open_sector_pieces ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	return deals, nil
}
