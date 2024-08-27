package model

import (
	"context"
	"fmt"
	"sync"

	"github.com/filecoin-project/curio/lib/curiochain"
	"github.com/filecoin-project/lotus/blockstore"
	"github.com/filecoin-project/lotus/chain/store"

	"github.com/filecoin-project/lotus/chain/actors/builtin/miner"

	"github.com/filecoin-project/lotus/api"

	"github.com/filecoin-project/lotus/api/v1api"
	"github.com/filecoin-project/lotus/chain/types"
	dTypes "github.com/strahe/curio-dashboard/types"
)

type Actor struct {
	Address dTypes.Address `json:"address"`
	Layers  []string       `json:"layers,omitempty"`

	powerMux sync.Mutex
	power    *api.MinerPower

	actorMux sync.Mutex
	actor    *types.Actor

	msMux      sync.Mutex
	minerState miner.State
}

func (a *Actor) Power(ctx context.Context, api v1api.FullNode) (*api.MinerPower, error) {
	a.powerMux.Lock()
	defer a.powerMux.Unlock()

	if a.power != nil {
		return a.power, nil
	}
	power, err := api.StateMinerPower(ctx, a.Address.Address, types.EmptyTSK)
	if err != nil {
		return nil, err
	}
	a.power = power
	return power, nil
}

func (a *Actor) ChainActor(ctx context.Context, api v1api.FullNode) (*types.Actor, error) {
	a.actorMux.Lock()
	defer a.actorMux.Unlock()

	if a.actor != nil {
		return a.actor, nil
	}

	actor, err := api.StateGetActor(ctx, a.Address.Address, types.EmptyTSK)
	if err != nil {
		return nil, fmt.Errorf("failed to get actor: %w", err)
	}
	a.actor = actor
	return actor, nil
}

func (a *Actor) MinerState(ctx context.Context, api v1api.FullNode) (miner.State, error) {
	a.msMux.Lock()
	defer a.msMux.Unlock()

	if a.minerState != nil {
		return a.minerState, nil
	}

	actor, err := a.ChainActor(ctx, api)
	if err != nil {
		return nil, fmt.Errorf("failed to get actor: %w", err)
	}
	sto := store.ActorStore(ctx, blockstore.NewReadCachedBlockstore(blockstore.NewAPIBlockstore(api), curiochain.ChainBlockCache))
	mas, err := miner.Load(sto, actor)
	if err != nil {
		return nil, fmt.Errorf("failed to load miner state: %w", err)
	}
	a.minerState = mas
	return mas, nil
}
