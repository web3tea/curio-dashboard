package model

import (
	"context"
	"fmt"
	"sync"

	"github.com/filecoin-project/lotus/api/v1api"
	"github.com/filecoin-project/lotus/blockstore"
	"github.com/filecoin-project/lotus/chain/actors/adt"
	"github.com/filecoin-project/lotus/chain/actors/builtin/miner"
	types2 "github.com/filecoin-project/lotus/chain/types"
	cbor "github.com/ipfs/go-ipld-cbor"
	"github.com/strahe/curio-dashboard/types"
)

type Miner struct {
	ID    types.Address
	Actor types2.Actor
}

type MinerBalance struct {
	ID    types.Address
	Actor types2.Actor
	state miner.State
	lk    sync.Mutex
}

func (m *MinerBalance) State(ctx context.Context, fullAPI v1api.FullNode) (miner.State, error) {
	m.lk.Lock()
	defer m.lk.Unlock()

	if m.state != nil {
		return m.state, nil
	}
	tbs := blockstore.NewTieredBstore(blockstore.NewAPIBlockstore(fullAPI), blockstore.NewMemory())

	mas, err := miner.Load(adt.WrapStore(ctx, cbor.NewCborStore(tbs)), &m.Actor)
	if err != nil {
		return nil, fmt.Errorf("loading miner state: %w", err)
	}
	m.state = mas

	return mas, nil
}
