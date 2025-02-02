package curiorpc

import (
	"context"

	"github.com/filecoin-project/curio/web/api/webrpc"
	"github.com/filecoin-project/go-address"
)

type WebRPC interface {
	ActorSectorExpirations(ctx context.Context, maddr address.Address) (*webrpc.SectorExpirations, error)
	ActorSummary(ctx context.Context) ([]webrpc.ActorSummary, error)
	ActorList(ctx context.Context) ([]string, error)
	ClusterMachines(ctx context.Context) ([]webrpc.MachineSummary, error)
	ClusterTaskHistory(ctx context.Context) ([]webrpc.TaskHistorySummary, error)
	ClusterNodeInfo(ctx context.Context, id int64) (*webrpc.MachineInfo, error)
	DealsPending(ctx context.Context) ([]webrpc.OpenDealInfo, error)
	DealsSealNow(ctx context.Context, spID, sectorNumber uint64) error
	HarmonyTaskStats(ctx context.Context) ([]webrpc.HarmonyTaskStats, error)
	HarmonyTaskMachines(ctx context.Context, taskName string) ([]webrpc.HarmonyMachineDesc, error)
	HarmonyTaskHistory(ctx context.Context, taskName string) ([]webrpc.HarmonyTaskHistory, error)
	PipelinePorepSectors(ctx context.Context) ([]sectorListEntry, error)
	PipelinePorepRestartAll(ctx context.Context) error
	PorepPipelineSummary(ctx context.Context) ([]webrpc.PorepPipelineSummary, error)
	SectorInfo(ctx context.Context, sp string, intid int64) (*webrpc.SectorInfo, error)
	SectorRemove(ctx context.Context, spid, id int) error
	StorageUseStats(ctx context.Context) ([]webrpc.StorageUseStats, error)
	StorageGCMarks(ctx context.Context) ([]webrpc.StorageGCMarks, error)
	StorageGCApprove(ctx context.Context, actor int64, sectorNum int64, fileType int64, storageID string) error
	StorageGCApproveAll(ctx context.Context) error
	StorageGCUnapproveAll(ctx context.Context) error
	SectorResume(ctx context.Context, spid, id int64) error
	SyncerState(ctx context.Context) ([]webrpc.RpcInfo, error)
	ClusterTaskSummary(ctx context.Context) ([]webrpc.TaskSummary, error)
	UpgradeSectors(ctx context.Context) ([]webrpc.UpgradeSector, error)
	UpgradeResetTaskIDs(ctx context.Context, spid, sectorNum uint64) error
	UpgradeDelete(ctx context.Context, spid, sectorNum uint64) error
	WinStats(ctx context.Context) ([]webrpc.WinStats, error)

	SetStorageAsk(ctx context.Context, ask *webrpc.StorageAsk) error
	MarketBalance(ctx context.Context) ([]webrpc.MarketBalanceStatus, error)
	MoveBalanceToEscrow(ctx context.Context, miner string, amount string, wallet string) (string, error)
	GetPriceFilters(ctx context.Context) ([]webrpc.PriceFilter, error)
	SetPriceFilters(ctx context.Context, name string, minDur, maxDur int, minSize, maxSize int64, price int64, verified bool) error
	AddPriceFilters(ctx context.Context, name string, minDur, maxDur int, minSize, maxSize int64, price int64, verified bool) error
	RemovePricingFilter(ctx context.Context, name string) error
	GetClientFilters(ctx context.Context) ([]webrpc.ClientFilter, error)
	SetClientFilters(ctx context.Context, name string, active bool, wallets, peers []string, filters []string, maxDealPerHour, maxDealSizePerHour int64, info string) error
	AddClientFilters(ctx context.Context, name string, active bool, wallets, peers []string, filters []string, maxDealPerHour, maxDealSizePerHour int64, info string) error
	RemoveClientFilter(ctx context.Context, name string) error
}

type sectorListEntry struct {
	webrpc.PipelineTask

	Address    address.Address
	CreateTime string
	AfterSeed  bool

	ChainAlloc, ChainSector, ChainActive, ChainUnproven, ChainFaulty bool
}
