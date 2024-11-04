package model

import (
	"github.com/strahe/curio-dashboard/types"
)

type Sector struct {
	SpID      types.ActorID
	SectorNum int
	Meta      *SectorMeta `json:"meta,omitempty"`
}

type SectorMeta struct {
	SpID            types.ActorID   `json:"spId"`
	SectorNum       int             `json:"sectorNum"`
	RegSealProof    int             `json:"regSealProof"`
	TicketEpoch     int             `json:"ticketEpoch"`
	TicketValue     types.ByteArray `json:"ticketValue,omitempty"`
	OrigSealedCid   string          `json:"origSealedCid"`
	OrigUnsealedCid string          `json:"origUnsealedCid"`
	CurSealedCid    string          `json:"curSealedCid"`
	CurUnsealedCid  string          `json:"curUnsealedCid"`
	MsgCidPrecommit *string         `json:"msgCidPrecommit,omitempty"`
	MsgCidCommit    *string         `json:"msgCidCommit,omitempty"`
	MsgCidUpdate    *string         `json:"msgCidUpdate,omitempty"`
	SeedEpoch       int             `json:"seedEpoch"`
	SeedValue       types.ByteArray `json:"seedValue,omitempty"`
	ExpirationEpoch int             `json:"expirationEpoch"`
	IsCC            bool            `json:"isCC"`
	Deadline        *int            `json:"deadline"`
	Partition       *int            `json:"partition"`
}

type SectorLocation struct {
	MinerID        types.ActorID `json:"minerId"`
	SectorNum      int           `json:"sectorNum"`
	SectorFiletype int           `json:"sectorFiletype"`
	StorageID      string        `json:"storageId"`
	IsPrimary      *bool         `json:"isPrimary"`
	ReadTS         *string       `json:"readTs"`
	ReadRefs       int           `json:"readRefs"`
	WriteTS        *string       `json:"writeTs"`
	WriteLockOwner *string       `json:"writeLockOwner"`
}
