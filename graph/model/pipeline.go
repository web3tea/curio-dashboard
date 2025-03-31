package model

import (
	"encoding/json"
	"time"

	"github.com/strahe/curio-dashboard/types"
)

type PorepStage int

const (
	PorepStageSDR PorepStage = iota + 1
	PorepStageTreeD
	PorepStageTreeC
	PorepStageTreeR
	PorepStageSynthetic
	PorepStagePrecommitMsg
	PorepStagePrecommitMsgWait
	PorepStageWaitSeed
	PorepStagePorep
	PorepStageCommitMsg
	PorepStageCommitMsgWait
	PorepStageFinalize
	PorepStageMoveStorage
)

var porepStageToString = map[PorepStage]string{
	PorepStageSDR:              "SDR",
	PorepStageTreeD:            "TreeD",
	PorepStageTreeC:            "TreeC",
	PorepStageTreeR:            "TreeR",
	PorepStageSynthetic:        "Synthetic",
	PorepStagePrecommitMsg:     "PrecommitMsg",
	PorepStagePrecommitMsgWait: "PrecommitMsgWait",
	PorepStageWaitSeed:         "WaitSeed",
	PorepStagePorep:            "Porep",
	PorepStageCommitMsg:        "CommitMsg",
	PorepStageCommitMsgWait:    "CommitMsgWait",
	PorepStageFinalize:         "Finalize",
	PorepStageMoveStorage:      "MoveStorage",
}

func (s PorepStage) String() string {
	if str, ok := porepStageToString[s]; ok {
		return str
	}
	return "Unknown"
}

func (s PorepStage) MarshalJSON() ([]byte, error) {
	return json.Marshal(s.String())
	// return fmt.Appendf(nil, `"%s"`, s.String()), nil
}

func (s *PorepStage) UnmarshalJSON(b []byte) (err error) {
	var ss string

	if err = json.Unmarshal(b, &ss); err != nil {
		return err
	}
	for k, v := range porepStageToString {
		if ss == v {
			*s = k
			return nil
		}
	}
	return nil
}

var AllPorepStages = []PorepStage{
	PorepStageSDR,
	PorepStageTreeD,
	PorepStageTreeC,
	PorepStageTreeR,
	PorepStageSynthetic,
	PorepStagePrecommitMsg,
	PorepStagePrecommitMsgWait,
	PorepStageWaitSeed,
	PorepStagePorep,
	PorepStageCommitMsg,
	PorepStageCommitMsgWait,
	PorepStageFinalize,
	PorepStageMoveStorage,
}

type Porep struct {
	ID                       string        `json:"id"`
	SpID                     types.Address `json:"spId"`
	SectorNumber             int           `json:"sectorNumber"`
	CreateTime               time.Time     `json:"createTime"`
	RegSealProof             int           `json:"regSealProof"`
	TicketEpoch              *int          `json:"ticketEpoch"`
	TicketValue              types.Bytes   `json:"ticketValue"`
	TaskIDSdr                *int          `json:"taskIdSdr"`
	AfterSdr                 bool          `json:"afterSdr"`
	TreeDCid                 *string       `json:"treeDCid"`
	TaskIDTreeD              *int          `json:"taskIdTreeD"`
	AfterTreeD               bool          `json:"afterTreeD"`
	TaskIDTreeC              *int          `json:"taskIdTreeC"`
	AfterTreeC               bool          `json:"afterTreeC"`
	TreeRCid                 *string       `json:"treeRCid"`
	TaskIDTreeR              *int          `json:"taskIdTreeR"`
	AfterTreeR               bool          `json:"afterTreeR"`
	PrecommitMsgCid          *string       `json:"precommitMsgCid"`
	TaskIDPrecommitMsg       *int          `json:"taskIdPrecommitMsg"`
	AfterPrecommitMsg        bool          `json:"afterPrecommitMsg"`
	SeedEpoch                *int          `json:"seedEpoch"`
	PrecommitMsgTsk          types.Bytes   `json:"precommitMsgTsk"`
	AfterPrecommitMsgSuccess bool          `json:"afterPrecommitMsgSuccess"`
	SeedValue                types.Bytes   `json:"seedValue"`
	TaskIDPorep              *int          `json:"taskIdPorep"`
	PorepProof               types.Bytes   `json:"porepProof"`
	AfterPorep               bool          `json:"afterPorep"`
	TaskIDFinalize           *int          `json:"taskIdFinalize"`
	AfterFinalize            bool          `json:"afterFinalize"`
	TaskIDMoveStorage        *int          `json:"taskIdMoveStorage"`
	AfterMoveStorage         bool          `json:"afterMoveStorage"`
	CommitMsgCid             *string       `json:"commitMsgCid"`
	TaskIDCommitMsg          *int          `json:"taskIdCommitMsg"`
	AfterCommitMsg           bool          `json:"afterCommitMsg"`
	CommitMsgTsk             types.Bytes   `json:"commitMsgTsk"`
	AfterCommitMsgSuccess    bool          `json:"afterCommitMsgSuccess"`
	Failed                   bool          `json:"failed"`
	FailedAt                 *time.Time    `json:"failedAt"`
	FailedReason             string        `json:"failedReason"`
	FailedReasonMsg          string        `json:"failedReasonMsg"`
	TaskIDSynth              *int          `json:"taskIdSynth"`
	AfterSynth               bool          `json:"afterSynth"`
	UserSectorDurationEpochs *int          `json:"userSectorDurationEpochs"`
	PrecommitReadyAt         *time.Time    `json:"precommitReadyAt"`
	CommitReadyAt            *time.Time    `json:"commitReadyAt"`
}
