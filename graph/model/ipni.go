package model

import "github.com/web3tea/curio-dashboard/types"

type IPNIStats struct{}

type IPNIAdvertisement struct {
	OrderNumber int         `json:"orderNumber"`
	PieceCid    *string     `json:"pieceCid"`
	AdCid       *string     `json:"adCid"`
	Previous    *string     `json:"previous"`
	ContextID   types.Bytes `json:"contextId"`
	PieceSize   *int        `json:"pieceSize"`
	Entries     *string     `json:"entries"`
	Addresses   *string     `json:"addresses"`
	IsSkip      *bool       `json:"isSkip"`
	IsRm        *bool       `json:"isRm"`
	Signature   types.Bytes `json:"signature"`
	// covert provider peer id to sp id
	ProviderPeerID *string `json:"-" db:"provider"`
}

type IPNIProvider struct {
	SpID   types.ActorID `json:"spID"`
	PeerID string        `json:"peerID"`
}
