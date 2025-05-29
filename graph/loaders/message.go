package loaders

import (
	"context"

	"github.com/web3tea/curio-dashboard/graph/model"
	"github.com/web3tea/curio-dashboard/types"
)

type MessageLoader interface {
	MessageSends(ctx context.Context, account *types.Address, offset int, limit int) ([]*model.MessageSend, error)
	MessageSendCount(ctx context.Context, account *types.Address) (int, error)
	MessageSend(ctx context.Context, sendTaskID *int, fromKey *string, nonce *int, signedCid *string) (*model.MessageSend, error)
	MessageWaits(ctx context.Context, waiterMachineID *int, offset int, limit int) ([]*model.MessageWait, error)
	MessageWaitsCount(ctx context.Context, waiterMachineID *int) (int, error)
	MessageWait(ctx context.Context, signedMessageCid string) (*model.MessageWait, error)
}

type MessageLoaderImpl struct {
	loader *Loader
}

func NewMessageLoader(loader *Loader) *MessageLoaderImpl {
	return &MessageLoaderImpl{loader}
}

func (l *MessageLoaderImpl) MessageSendCount(ctx context.Context, account *types.Address) (int, error) {
	var result int
	err := l.loader.db.QueryRow(ctx, `
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
	err := l.loader.db.Select(ctx, &result, `
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

	err := l.loader.db.QueryRow(ctx, `
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

func (l *MessageLoaderImpl) MessageWaitsCount(ctx context.Context, waiterMachineID *int) (int, error) {
	var result int
	err := l.loader.db.QueryRow(ctx, `
SELECT
    COUNT(*)
FROM
    message_waits
WHERE
    ($1::int IS NULL OR waiter_machine_id = $1)`, waiterMachineID).Scan(&result)
	return result, err
}

func (l *MessageLoaderImpl) MessageWaits(ctx context.Context, waiterMachineID *int, offset int, limit int) ([]*model.MessageWait, error) {
	var result []*model.MessageWait

	err := l.loader.db.Select(ctx, &result, `
SELECT
    signed_message_cid,
    waiter_machine_id,
    executed_tsk_cid,
    executed_tsk_epoch,
    executed_msg_cid,
    executed_msg_data,
    executed_rcpt_exitcode,
    executed_rcpt_return,
    executed_rcpt_gas_used,
    created_at
FROM
    message_waits
WHERE
    ($1::int IS NULL OR waiter_machine_id = $1)
ORDER BY
    created_at DESC
LIMIT $2 OFFSET $3;`, waiterMachineID, limit, offset)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (l *MessageLoaderImpl) MessageWait(ctx context.Context, signedMessageCid string) (*model.MessageWait, error) {
	var result model.MessageWait

	err := l.loader.db.QueryRow(ctx, `
SELECT
    signed_message_cid,
    waiter_machine_id,
    executed_tsk_cid,
    executed_tsk_epoch,
    executed_msg_cid,
    executed_msg_data,
    executed_rcpt_exitcode,
    executed_rcpt_return,
    executed_rcpt_gas_used,
    created_at
FROM
    message_waits
WHERE
    signed_message_cid = $1
LIMIT 1;`, signedMessageCid).Scan(
		&result.SignedMessageCid,
		&result.WaiterMachineID,
		&result.ExecutedTskCid,
		&result.ExecutedTskEpoch,
		&result.ExecutedMsgCid,
		&result.ExecutedMsgData,
		&result.ExecutedRcptExitcode,
		&result.ExecutedRcptReturn,
		&result.ExecutedRcptGasUsed,
		&result.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &result, nil
}
