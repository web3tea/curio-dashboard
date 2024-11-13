package ffi

import (
	"os"

	"github.com/filecoin-project/filecoin-ffi/cgo"
	"github.com/filecoin-project/go-state-types/abi"
	"github.com/filecoin-project/go-state-types/network"
	"github.com/filecoin-project/go-state-types/proof"
	"github.com/ipfs/go-cid"
)

type PartitionProof proof.PoStProof
type FunctionsSectorUpdate struct{}
type Message = []byte

const SignatureBytes = 96

const PublicKeyBytes = 48

// Signature is a compressed affine
type Signature = [SignatureBytes]byte
type PublicKey = [PublicKeyBytes]byte

type PrivateSectorInfo struct {
	proof.SectorInfo
	CacheDirPath     string
	PoStProofType    abi.RegisteredPoStProof
	SealedSectorPath string
}

type FallbackChallenges struct {
	Sectors    []abi.SectorNumber
	Challenges map[abi.SectorNumber][]uint64
}

var SectorUpdate = FunctionsSectorUpdate{}

func (FunctionsSectorUpdate) EncodeInto(
	proofType abi.RegisteredUpdateProof,
	newReplicaPath string,
	newReplicaCachePath string,
	sectorKeyPath string,
	sectorKeyCachePath string,
	stagedDataPath string,
	pieces []abi.PieceInfo,
) (sealedCID cid.Cid, unsealedCID cid.Cid, err error) {
	panic("not implemented")
}

func GenerateSinglePartitionWindowPoStWithVanilla(
	proofType abi.RegisteredPoStProof,
	minerID abi.ActorID,
	randomness abi.PoStRandomness,
	proofs [][]byte,
	partitionIndex uint,
) (*PartitionProof, error) {
	panic("not implemented")
}

func GenerateWinningPoStWithVanilla(
	proofType abi.RegisteredPoStProof,
	minerID abi.ActorID,
	randomness abi.PoStRandomness,
	proofs [][]byte,
) ([]proof.PoStProof, error) {
	panic("not implemented")
}

func (FunctionsSectorUpdate) GenerateUpdateProofWithVanilla(
	proofType abi.RegisteredUpdateProof,
	oldSealedCID cid.Cid,
	newSealedCID cid.Cid,
	unsealedCID cid.Cid,
	vanillaProofs [][]byte,
) ([]byte, error) {
	panic("not implemented")
}

func GenerateSingleVanillaProof(
	replica PrivateSectorInfo,
	challenges []uint64,
) ([]byte, error) {
	panic("not implemented")
}

func SealCommitPhase1(
	proofType abi.RegisteredSealProof,
	sealedCID cid.Cid,
	unsealedCID cid.Cid,
	cacheDirPath string,
	sealedSectorPath string,
	sectorNum abi.SectorNumber,
	minerID abi.ActorID,
	ticket abi.SealRandomness,
	seed abi.InteractiveSealRandomness,
	pieces []abi.PieceInfo,
) (phase1Output []byte, err error) {
	panic("not implemented")
}

type FVMOpts struct {
	FVMVersion uint64
	Externs    cgo.Externs

	Epoch          abi.ChainEpoch
	Timestamp      uint64
	ChainID        uint64
	BaseFee        abi.TokenAmount
	BaseCircSupply abi.TokenAmount
	NetworkVersion network.Version
	StateBase      cid.Cid
	Tracing        bool

	Debug         bool
	ActorRedirect cid.Cid
}

type FVM struct {
	executor *cgo.FvmMachine
}

func CreateFVM(opts *FVMOpts) (*FVM, error) {
	panic("not implemented")
}

func SealPreCommitPhase2(
	phase1Output []byte,
	cacheDirPath string,
	sealedSectorPath string,
) (sealedCID cid.Cid, unsealedCID cid.Cid, err error) {
	panic("not implemented")
}

func SealCommitPhase2(
	phase1Output []byte,
	sectorNum abi.SectorNumber,
	minerID abi.ActorID,
) ([]byte, error) {
	panic("not implemented")
}

type ApplyRet struct {
	Return             []byte
	ExitCode           uint64
	GasUsed            int64
	MinerPenalty       abi.TokenAmount
	MinerTip           abi.TokenAmount
	BaseFeeBurn        abi.TokenAmount
	OverEstimationBurn abi.TokenAmount
	Refund             abi.TokenAmount
	GasRefund          int64
	GasBurned          int64
	ExecTraceBytes     []byte
	FailureInfo        string
	EventsRoot         *cid.Cid
	EventsBytes        []byte
}

func (f *FVM) ApplyMessage(msgBytes []byte, chainLen uint) (*ApplyRet, error) {
	panic("not implemented")
}

func (f *FVM) ApplyImplicitMessage(msgBytes []byte) (*ApplyRet, error) {
	panic("not implemented")
}

func (f *FVM) Flush() (cid.Cid, error) {
	panic("not implemented")
}

func GenerateSDR(
	proofType abi.RegisteredSealProof,
	cacheDirPath string,
	replicaId [32]byte,
) (err error) {
	panic("not implemented")
}

func VerifySeal(info proof.SealVerifyInfo) (bool, error) {
	panic("not implemented")
}

func ClearSyntheticProofs(sectorSize uint64, cacheDirPath string) error {
	panic("not implemented")
}

func ClearCache(sectorSize uint64, cacheDirPath string) error {
	panic("not implemented")
}

func GenerateSynthProofs(
	proofType abi.RegisteredSealProof,
	sealedCID, unsealedCID cid.Cid,
	cacheDirPath, replicaPath string,
	sector_id abi.SectorNumber,
	minerID abi.ActorID,
	ticket []byte,
	pieces []abi.PieceInfo,
) error {
	panic("not implemented")
}

func (FunctionsSectorUpdate) GenerateUpdateVanillaProofs(
	proofType abi.RegisteredUpdateProof,
	oldSealedCID cid.Cid,
	newSealedCID cid.Cid,
	unsealedCID cid.Cid,
	newReplicaPath string,
	newReplicaCachePath string,
	sectorKeyPath string,
	sectorKeyCachePath string,
) ([][]byte, error) {
	panic("not implemented")
}

type SortedPrivateSectorInfo struct {
	f []PrivateSectorInfo
}

func GenerateWinningPoSt(
	minerID abi.ActorID,
	privateSectorInfo SortedPrivateSectorInfo,
	randomness abi.PoStRandomness,
) ([]proof.PoStProof, error) {
	panic("not implemented")
}

func GenerateWindowPoSt(
	minerID abi.ActorID,
	privateSectorInfo SortedPrivateSectorInfo,
	randomness abi.PoStRandomness,
) ([]proof.PoStProof, []abi.SectorNumber, error) {
	panic("not implemented")
}

func AggregateSealProofs(aggregateInfo proof.AggregateSealVerifyProofAndInfos, proofs [][]byte) (out []byte, err error) {
	panic("not implemented")
}

func (FunctionsSectorUpdate) DecodeFrom(
	proofType abi.RegisteredUpdateProof,
	outDataPath string,
	replicaPath string,
	sectorKeyPath string,
	sectorKeyCachePath string,
	unsealedCID cid.Cid,
) error {
	panic("not implemented")
}

func UnsealRange(
	proofType abi.RegisteredSealProof,
	cacheDirPath string,
	sealedSector *os.File,
	unsealOutput *os.File,
	sectorNum abi.SectorNumber,
	minerID abi.ActorID,
	ticket abi.SealRandomness,
	unsealedCID cid.Cid,
	unpaddedByteIndex uint64,
	unpaddedBytesAmount uint64,
) error {
	panic("not implemented")
}

func SealPreCommitPhase1(
	proofType abi.RegisteredSealProof,
	cacheDirPath string,
	stagedSectorPath string,
	sealedSectorPath string,
	sectorNum abi.SectorNumber,
	minerID abi.ActorID,
	ticket abi.SealRandomness,
	pieces []abi.PieceInfo,
) (phase1Output []byte, err error) {
	panic("not implemented")
}

func (FunctionsSectorUpdate) RemoveData(
	proofType abi.RegisteredUpdateProof,
	sectorKeyPath string,
	sectorKeyCachePath string,
	replicaPath string,
	replicaCachePath string,
	dataPath string,
	unsealedCID cid.Cid,
) error {
	panic("not implemented")
}

func NewSortedPrivateSectorInfo(sectorInfo ...PrivateSectorInfo) SortedPrivateSectorInfo {
	panic("not implemented")
}

func VerifyAggregateSeals(aggregate proof.AggregateSealVerifyProofAndInfos) (bool, error) {
	panic("not implemented")
}

func (FunctionsSectorUpdate) VerifyUpdateProof(info proof.ReplicaUpdateInfo) (bool, error) {
	panic("not implemented")
}

func VerifyWindowPoSt(info proof.WindowPoStVerifyInfo) (bool, error) {
	panic("not implemented")
}

func GenerateWinningPoStSectorChallenge(
	proofType abi.RegisteredPoStProof,
	minerID abi.ActorID,
	randomness abi.PoStRandomness,
	eligibleSectorsLen uint64,
) ([]uint64, error) {
	panic("not implemented")
}

func (FunctionsSectorUpdate) VerifyVanillaProofs(
	proofType abi.RegisteredUpdateProof,
	oldSealedCID cid.Cid,
	newSealedCID cid.Cid,
	unsealedCID cid.Cid,
	vanillaProofs [][]byte,
) (bool, error) {
	panic("not implemented")
}

func VerifyWinningPoSt(info proof.WinningPoStVerifyInfo) (bool, error) {
	panic("not implemented")
}

func HashVerify(signature *Signature, messages []Message, publicKeys []PublicKey) bool {
	panic("not implemented")
}

func Aggregate(signatures []Signature) *Signature {
	panic("not implemented")
}

func CreateZeroSignature() Signature {
	panic("not implemented")
}

func GeneratePoStFallbackSectorChallenges(
	proofType abi.RegisteredPoStProof,
	minerID abi.ActorID,
	randomness abi.PoStRandomness,
	sectorIds []abi.SectorNumber,
) (*FallbackChallenges, error) {
	panic("not implemented")
}

func MergeWindowPoStPartitionProofs(
	proofType abi.RegisteredPoStProof,
	partitionProofs []PartitionProof,
) (*proof.PoStProof, error) {
	panic("not implemented")
}

func GetGPUDevices() ([]string, error) {
	return []string{}, nil
}
