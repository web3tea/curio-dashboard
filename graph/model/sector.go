package model

import (
	"database/sql"

	"github.com/strahe/curio-dashboard/types"
)

type Sector struct {
	SpID      types.Address
	SectorNum int
	Meta      *SectorMeta `json:"meta,omitempty"`
}

type SectorMeta struct {
	SpID            types.Address    `json:"spId"`
	SectorNum       int              `json:"sectorNum"`
	RegSealProof    int              `json:"regSealProof"`
	TicketEpoch     int              `json:"ticketEpoch"`
	TicketValue     types.ByteArray  `json:"ticketValue,omitempty"`
	OrigSealedCid   string           `json:"origSealedCid"`
	OrigUnsealedCid string           `json:"origUnsealedCid"`
	CurSealedCid    string           `json:"curSealedCid"`
	CurUnsealedCid  string           `json:"curUnsealedCid"`
	MsgCidPrecommit sql.Null[string] `json:"msgCidPrecommit,omitempty"`
	MsgCidCommit    sql.Null[string] `json:"msgCidCommit,omitempty"`
	MsgCidUpdate    sql.Null[string] `json:"msgCidUpdate,omitempty"`
	SeedEpoch       int              `json:"seedEpoch"`
	SeedValue       types.ByteArray  `json:"seedValue,omitempty"`
	ExpirationEpoch sql.Null[int]    `json:"expirationEpoch,omitempty"`
	IsCC            bool             `json:"isCC"`
	Deadline        sql.Null[int]    `json:"deadline,omitempty"`
	Partition       sql.Null[int]    `json:"partition,omitempty"`
}

type SectorLocation struct {
	MinerID        types.Address    `json:"minerId"`
	SectorNum      int              `json:"sectorNum"`
	SectorFiletype int              `json:"sectorFiletype"`
	StorageID      string           `json:"storageId"`
	IsPrimary      sql.Null[bool]   `json:"isPrimary,omitempty"`
	ReadTS         sql.Null[string] `json:"readTs,omitempty"`
	ReadRefs       int              `json:"readRefs"`
	WriteTS        sql.Null[string] `json:"writeTs,omitempty"`
	WriteLockOwner sql.Null[string] `json:"writeLockOwner,omitempty"`
}
