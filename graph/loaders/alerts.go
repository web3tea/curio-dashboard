package loaders

import (
	"context"
	"time"

	"github.com/strahe/curio-dashboard/graph/model"
)

type AlertLoader interface {
	Alerts(ctx context.Context) ([]*model.Alert, error)
	SubAlerts(ctx context.Context, offset int) (<-chan *model.Alert, error)
}

func (l *Loader) Alerts(ctx context.Context) ([]*model.Alert, error) {
	var alerts []*model.Alert
	if err := l.db.Select(ctx, &alerts, "SELECT * FROM alerts ORDER BY id DESC"); err != nil {
		return nil, err
	}
	return alerts, nil
}

func (l *Loader) SubAlerts(ctx context.Context, offset int) (<-chan *model.Alert, error) {
	alertsChan := make(chan *model.Alert)

	log.Infof("SubAlerts: offset=%d", offset)
	go func() {
		var err error
		ticker := time.NewTicker(time.Second * 3)
		defer func() {
			ticker.Stop()
			close(alertsChan)
			if err != nil {
				log.Infof("SubAlerts done, err: %v", err)
			} else {
				log.Infof("SubAlerts done")
			}
		}()

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				var alerts []*model.Alert
				if err = l.db.Select(ctx, &alerts, "SELECT * FROM alerts WHERE id > $1 ORDER BY id", offset); err != nil {
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
