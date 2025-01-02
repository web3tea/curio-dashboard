package loaders

import (
	"context"

	"github.com/strahe/curio-dashboard/db"
	"github.com/strahe/curio-dashboard/graph/model"
	"github.com/strahe/curio-dashboard/types"
)

type MessageLoader interface {
	MessageSends(ctx context.Context, account *types.Address, offset int, limit int) ([]*model.MessageSend, error)
	MessageSendCount(ctx context.Context, account *types.Address) (int, error)
	MessageSend(ctx context.Context, sendTaskID *int, fromKey *string, nonce *int, signedCid *string) (*model.MessageSend, error)
}

type MessageLoaderImpl struct {
	db *db.HarmonyDB
}

func (l *MessageLoaderImpl) MessageSendCount(ctx context.Context, account *types.Address) (int, error) {
	var result int
	err := l.db.QueryRow(ctx, `
SELECT 
    COUNT(*) 
FROM 
    message_sends 
WHERE 
    ($1::text IS NULL OR from_key = $1 OR to_addr = $1)`, account).Scan(&result)
	return result, err
}

func (l *MessageLoaderImpl) MessageSends(ctx context.Context, account *types.Address, offset int, limit int) ([]*model.MessageSend, error) {
	var result []*model.MessageSend

	// important: send_time and to_addr are not indexed
	err := l.db.Select(ctx, &result, `
SELECT
    from_key,
    to_addr,
    send_reason,
    send_task_id,
    unsigned_data,
    unsigned_cid,
    nonce,
    signed_data,
    signed_json,
    signed_cid,
    send_time,
    send_success,
    send_error
FROM
    message_sends
WHERE
    ($1::text IS NULL OR from_key = $1 OR to_addr = $1)
ORDER BY
    send_task_id DESC
LIMIT $2 OFFSET $3;`, account, limit, offset)

	if err != nil {
		return nil, err
	}
	return result, nil
}

func (l *MessageLoaderImpl) MessageSend(ctx context.Context, sendTaskID *int, fromKey *string, nonce *int, signedCid *string) (*model.MessageSend, error) {
	var result model.MessageSend

	err := l.db.QueryRow(ctx, `
SELECT
    from_key,
    to_addr,
    send_reason,
    send_task_id,
    unsigned_data,
    unsigned_cid,
    nonce,
    signed_data,
    signed_json,
    signed_cid,
    send_time,
    send_success,
    send_error
FROM
    message_sends
WHERE
    ($1::int IS NOT NULL AND send_task_id = $1) OR
    ($2::text IS NOT NULL AND $3::int IS NOT NULL AND from_key = $2 AND nonce = $3) OR
    ($4::text IS NOT NULL AND signed_cid = $4)
LIMIT 1;`, sendTaskID, fromKey, nonce, signedCid).Scan(&result.FromKey,
		&result.ToAddr,
		&result.SendReason,
		&result.SendTaskID,
		&result.UnsignedData,
		&result.UnsignedCid,
		&result.Nonce,
		&result.SignedData,
		&result.SignedJSON,
		&result.SignedCid,
		&result.SendTime,
		&result.SendSuccess,
		&result.SendError)

	if err != nil {
		return nil, err
	}
	return &result, nil
}

func NewMessageLoader(db *db.HarmonyDB) *MessageLoaderImpl {
	return &MessageLoaderImpl{
		db: db,
	}
}

var _ MessageLoader = &MessageLoaderImpl{}
