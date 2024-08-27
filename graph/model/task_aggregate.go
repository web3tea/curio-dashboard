package model

import "time"

type TaskAggregate struct {
	Time    time.Time `json:"time"`
	Total   int       `json:"total"`
	Success int       `json:"success"`
	Failure int       `json:"failure"`
}
