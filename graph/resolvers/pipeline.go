package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.68

import (
	"context"
	"fmt"
	"time"

	"github.com/samber/lo"
	"github.com/web3tea/curio-dashboard/graph"
	"github.com/web3tea/curio-dashboard/graph/cachecontrol"
	"github.com/web3tea/curio-dashboard/graph/model"
	"github.com/web3tea/curio-dashboard/types"
)

// Sdr is the resolver for the sdr field.
func (r *pipelineSummaryResolver) Sdr(ctx context.Context, obj *model.PipelineSummary) (int, error) {
	var out int
	err := r.db.QueryRow(ctx, "SELECT COUNT(*) FROM sectors_sdr_pipeline WHERE sp_id = $1 AND after_sdr = false", obj.ID).Scan(&out)
	return out, err
}

// Trees is the resolver for the trees field.
func (r *pipelineSummaryResolver) Trees(ctx context.Context, obj *model.PipelineSummary) (int, error) {
	var out int
	err := r.db.QueryRow(ctx, "SELECT COUNT(*) FROM sectors_sdr_pipeline WHERE sp_id = $1 AND (after_tree_d = false OR after_tree_c = false OR after_tree_r = false) AND after_sdr = true", obj.ID).Scan(&out)
	return out, err
}

// PrecommitMsg is the resolver for the precommitMsg field.
func (r *pipelineSummaryResolver) PrecommitMsg(ctx context.Context, obj *model.PipelineSummary) (int, error) {
	var out int
	err := r.db.QueryRow(ctx, "SELECT COUNT(*) FROM sectors_sdr_pipeline WHERE sp_id = $1 AND after_tree_r = true and after_precommit_msg = false", obj.ID).Scan(&out)
	return out, err
}

// WaitSeed is the resolver for the waitSeed field.
func (r *pipelineSummaryResolver) WaitSeed(ctx context.Context, obj *model.PipelineSummary) (int, error) {
	head, err := r.fullNode.ChainHead(ctx)
	if err != nil {
		return 0, err
	}
	var out int
	err = r.db.QueryRow(ctx, "SELECT COUNT(*) FROM sectors_sdr_pipeline WHERE sp_id = $1 AND after_precommit_msg_success = true AND seed_epoch > $2", obj.ID, head.Height()).Scan(&out)
	return out, err
}

// Porep is the resolver for the porep field.
func (r *pipelineSummaryResolver) Porep(ctx context.Context, obj *model.PipelineSummary) (int, error) {
	var out int
	err := r.db.QueryRow(ctx, "SELECT COUNT(*) FROM sectors_sdr_pipeline WHERE sp_id = $1 AND after_porep = false AND after_precommit_msg_success = true", obj.ID).Scan(&out)
	return out, err
}

// CommitMsg is the resolver for the commitMsg field.
func (r *pipelineSummaryResolver) CommitMsg(ctx context.Context, obj *model.PipelineSummary) (int, error) {
	var out int
	err := r.db.QueryRow(ctx, "SELECT COUNT(*) FROM sectors_sdr_pipeline WHERE sp_id = $1 AND after_commit_msg_success = false AND after_porep = true", obj.ID).Scan(&out)
	return out, err
}

// Done is the resolver for the done field.
func (r *pipelineSummaryResolver) Done(ctx context.Context, obj *model.PipelineSummary) (int, error) {
	var out int
	err := r.db.QueryRow(ctx, "SELECT COUNT(*) FROM sectors_sdr_pipeline WHERE sp_id = $1 AND after_commit_msg_success = true", obj.ID).Scan(&out)
	return out, err
}

// Failed is the resolver for the failed field.
func (r *pipelineSummaryResolver) Failed(ctx context.Context, obj *model.PipelineSummary) (int, error) {
	var out int
	err := r.db.QueryRow(ctx, "SELECT COUNT(*) FROM sectors_sdr_pipeline WHERE sp_id = $1 AND failed = true", obj.ID).Scan(&out)
	return out, err
}

// ID is the resolver for the id field.
func (r *porepResolver) ID(ctx context.Context, obj *model.Porep) (string, error) {
	return fmt.Sprintf("%s-%d", obj.SpID, obj.SectorNumber), nil
}

// Status is the resolver for the status field.
func (r *porepResolver) Status(ctx context.Context, obj *model.Porep) (model.TaskStatus, error) {
	if obj.Failed {
		return model.TaskStatusFailed, nil
	}
	if obj.AfterMoveStorage {
		return model.TaskStatusCompleted, nil
	}
	return model.TaskStatusRunning, nil
}

// Stage is the resolver for the stage field.
func (r *porepResolver) Stage(ctx context.Context, obj *model.Porep) (model.PorepStage, error) {
	if obj.AfterMoveStorage {
		return model.PorepStageMoveStorage, nil
	}
	if obj.AfterFinalize && !obj.AfterMoveStorage {
		return model.PorepStageFinalize, nil
	}
	if obj.AfterCommitMsgSuccess && !obj.AfterFinalize {
		return model.PorepStageCommitMsgWait, nil
	}
	if obj.AfterCommitMsg && !obj.AfterCommitMsgSuccess {
		return model.PorepStageCommitMsg, nil
	}
	if obj.AfterPorep && !obj.AfterCommitMsg {
		return model.PorepStagePorep, nil
	}
	if obj.AfterPrecommitMsgSuccess && !obj.AfterPorep {
		return model.PorepStageWaitSeed, nil
	}
	if obj.AfterPrecommitMsg && !obj.AfterPrecommitMsgSuccess {
		return model.PorepStagePrecommitMsgWait, nil
	}
	if obj.AfterSynth && !obj.AfterPrecommitMsg {
		return model.PorepStagePrecommitMsg, nil
	}
	if obj.AfterTreeR && !obj.AfterSynth {
		return model.PorepStageSynthetic, nil
	}
	if obj.AfterTreeC && !obj.AfterTreeR {
		return model.PorepStageTreeR, nil
	}
	if obj.AfterTreeD && !obj.AfterTreeC {
		return model.PorepStageTreeC, nil
	}
	if obj.AfterSdr && !obj.AfterTreeD {
		return model.PorepStageTreeD, nil
	}
	return model.PorepStageSdr, nil
}

// CurrentTask is the resolver for the currentTask field.
func (r *porepResolver) CurrentTask(ctx context.Context, obj *model.Porep) (*model.Task, error) {
	status, err := r.Status(ctx, obj)
	if err != nil {
		return nil, err
	}
	if status == model.TaskStatusFailed || status == model.TaskStatusCompleted {
		return nil, nil
	}

	stage, err := r.Stage(ctx, obj)
	if err != nil {
		return nil, err
	}

	var taskID *int
	switch stage {
	case model.PorepStageSdr:
		taskID = obj.TaskIDSdr
	case model.PorepStageTreeD:
		taskID = obj.TaskIDTreeD
	case model.PorepStageTreeC:
		taskID = obj.TaskIDTreeC
	case model.PorepStageTreeR:
		taskID = obj.TaskIDTreeR
	case model.PorepStageSynthetic:
		taskID = obj.TaskIDSynth
	case model.PorepStagePrecommitMsg:
		taskID = obj.TaskIDPrecommitMsg
	case model.PorepStagePrecommitMsgWait:
		return nil, nil // No task for waiting stages
	case model.PorepStageWaitSeed:
		return nil, nil // No task for waiting stages
	case model.PorepStagePorep:
		taskID = obj.TaskIDPorep
	case model.PorepStageCommitMsg:
		taskID = obj.TaskIDCommitMsg
	case model.PorepStageCommitMsgWait:
		return nil, nil // No task for waiting stages
	case model.PorepStageFinalize:
		taskID = obj.TaskIDFinalize
	case model.PorepStageMoveStorage:
		taskID = obj.TaskIDMoveStorage
	}

	if taskID != nil {
		task, err := r.loader.Task(ctx, *taskID)
		if err != nil {
			log.Warnf("Failed to load task %d: %s", *taskID, err)
			return nil, nil
		}
		return task, nil
	}
	return nil, nil
}

// CompactStages is the resolver for the compactStages field.
func (r *porepResolver) CompactStages(ctx context.Context, obj *model.Porep) ([]*model.TaskCompactStage, error) {
	current, err := r.Stage(ctx, obj)
	if err != nil {
		return nil, err
	}

	stages := []*model.TaskCompactStage{}

	for _, stage := range model.AllPorepStage {
		currentIdx := lo.IndexOf(model.AllPorepStage, current)
		stageIdx := lo.IndexOf(model.AllPorepStage, stage)
		ss := &model.TaskCompactStage{
			Name: stage.String(),
			Status: lo.If(currentIdx > stageIdx, model.TaskStatusCompleted).
				ElseIf(currentIdx == stageIdx, model.TaskStatusRunning).
				Else(model.TaskStatusPending),
		}
		switch stage {
		case model.PorepStageSdr:
			ss.TaskID = obj.TaskIDSdr
		case model.PorepStageTreeD:
			ss.TaskID = obj.TaskIDTreeD
		case model.PorepStageTreeC:
			ss.TaskID = obj.TaskIDTreeC
		case model.PorepStageTreeR:
			ss.TaskID = obj.TaskIDTreeR
		case model.PorepStageSynthetic:
			ss.TaskID = obj.TaskIDSynth
		case model.PorepStagePrecommitMsg:
			ss.TaskID = obj.TaskIDPrecommitMsg
			ss.Name = "Precommit"
		case model.PorepStagePrecommitMsgWait:
			continue
		case model.PorepStageWaitSeed:
		case model.PorepStagePorep:
			ss.TaskID = obj.TaskIDPorep
		case model.PorepStageCommitMsg:
			ss.TaskID = obj.TaskIDCommitMsg
			ss.Name = "Commit"
		case model.PorepStageCommitMsgWait:
			continue
		case model.PorepStageFinalize:
			ss.TaskID = obj.TaskIDFinalize
		case model.PorepStageMoveStorage:
			ss.TaskID = obj.TaskIDMoveStorage
		}
		stages = append(stages, ss)
	}
	return stages, nil
}

// Poreps is the resolver for the poreps field.
func (r *queryResolver) Poreps(ctx context.Context) ([]*model.Porep, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute*5)
	return r.loader.Poreps(ctx)
}

// Porep is the resolver for the porep field.
func (r *queryResolver) Porep(ctx context.Context, sp types.Address, sectorNumber int) (*model.Porep, error) {
	return r.loader.Porep(ctx, sp, sectorNumber)
}

// PipelinesSummary is the resolver for the pipelinesSummary field.
func (r *queryResolver) PipelinesSummary(ctx context.Context) ([]*model.PipelineSummary, error) {
	cachecontrol.SetHint(ctx, cachecontrol.ScopePrivate, time.Minute*5)
	return r.loader.PipelinesSummary(ctx)
}

// PipelineSummary returns graph.PipelineSummaryResolver implementation.
func (r *Resolver) PipelineSummary() graph.PipelineSummaryResolver {
	return &pipelineSummaryResolver{r}
}

// Porep returns graph.PorepResolver implementation.
func (r *Resolver) Porep() graph.PorepResolver { return &porepResolver{r} }

type pipelineSummaryResolver struct{ *Resolver }
type porepResolver struct{ *Resolver }
