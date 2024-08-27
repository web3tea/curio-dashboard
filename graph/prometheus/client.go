package prometheus

import (
	"context"
	"fmt"
	"strconv"
	"time"

	logging "github.com/ipfs/go-log/v2"
	v1 "github.com/prometheus/client_golang/api/prometheus/v1"
	pModel "github.com/prometheus/common/model"
	"github.com/strahe/curio-dashboard/graph/model"
)

var log = logging.Logger("metrics")

type Client struct {
	client v1.API
}

func NewClient(client v1.API) *Client {
	return &Client{client: client}
}

func (p *Client) RangeActiveTasks(ctx context.Context, start, end time.Time, machine *string) ([]*model.MetricsActiveTask, error) {

	var query string
	if machine == nil {
		query = "sum(curio_harmonytask_active_tasks) by (task_name)"
	} else {
		query = fmt.Sprintf("sum(curio_harmonytask_active_tasks{instance='%s'}) by (task_name)", *machine)
	}

	value, warning, err := p.client.QueryRange(ctx, query, v1.Range{
		Start: start,
		End:   end,
		Step:  end.Sub(start) / 144,
	})

	if err != nil {
		return nil, err
	}
	if warning != nil {
		log.Warnw("warning from Prometheus", "warning", warning)
	}
	var result []*model.MetricsActiveTask
	data := value.(pModel.Matrix)
	for _, i := range data {
		at := &model.MetricsActiveTask{
			Name: string(i.Metric["task_name"]),
		}
		for _, j := range i.Values {
			f, _ := strconv.ParseFloat(j.Value.String(), 64)
			at.Series = append(at.Series, []float64{float64(j.Timestamp), f})
		}
		result = append(result, at)
	}
	return result, nil
}
