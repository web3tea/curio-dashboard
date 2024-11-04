package model

import (
	"database/sql"

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
	MsgCidPrecommit sql.NullString  `json:"msgCidPrecommit,omitempty"`
	MsgCidCommit    sql.NullString  `json:"msgCidCommit,omitempty"`
	MsgCidUpdate    sql.NullString  `json:"msgCidUpdate,omitempty"`
	SeedEpoch       int             `json:"seedEpoch"`
	SeedValue       types.ByteArray `json:"seedValue,omitempty"`
	ExpirationEpoch sql.NullInt64   `json:"expirationEpoch"`
	IsCC            bool            `json:"isCC"`
	Deadline        sql.NullInt64   `json:"deadline"`
	Partition       sql.NullInt64   `json:"partition"`
}

type SectorLocation struct {
	MinerID        types.ActorID  `json:"minerId"`
	SectorNum      int            `json:"sectorNum"`
	SectorFiletype int            `json:"sectorFiletype"`
	StorageID      string         `json:"storageId"`
	IsPrimary      sql.NullBool   `json:"isPrimary"`
	ReadTS         sql.NullString `json:"readTs"`
	ReadRefs       int            `json:"readRefs"`
	WriteTS        sql.NullString `json:"writeTs"`
	WriteLockOwner sql.NullString `json:"writeLockOwner"`
}
