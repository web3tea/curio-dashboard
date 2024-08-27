package loaders

import (
	"context"
	"time"

	"github.com/strahe/curio-dashboard/graph/model"
)

func (l *Loader) Alerts(ctx context.Context) ([]*model.Alert, error) {
	var alerts []*model.Alert
	if err := l.db.Select(ctx, &alerts, "SELECT * FROM alerts ORDER BY id DESC"); err != nil {
		return nil, err
	}
	return alerts, nil
}

func (l *Loader) SubAlerts(ctx context.Context, offset int) (<-chan *model.Alert, error) {
	alertsChan := make(chan *model.Alert)

	go func() {
		defer close(alertsChan)
		ticker := time.NewTicker(time.Second * 3)
		defer ticker.Stop()

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				var alerts []*model.Alert
				if err := l.db.Select(ctx, &alerts, "SELECT * FROM alerts WHERE id > $1 ORDER BY id", offset); err != nil {
					return
				}
				for _, alert := range alerts {
					select {
					case <-ctx.Done():
						return
					case alertsChan <- alert:
						if offset < alert.ID {
							offset = alert.ID
						}
					}
				}
			}
		}
	}()
	return alertsChan, nil
}
