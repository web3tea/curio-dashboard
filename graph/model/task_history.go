package model

import "time"

type TaskHistory struct {
	ID                     int       `json:"id"`
	TaskID                 int       `json:"taskId"`
	Name                   string    `json:"name"`
	Posted                 time.Time `json:"posted"`
	WorkStart              time.Time `json:"workStart"`
	WorkEnd                time.Time `json:"workEnd"`
	Result                 bool      `json:"result"`
	Err                    *string   `json:"err"`
	CompletedByHostAndPort string    `json:"completedByHostAndPort"`
}
