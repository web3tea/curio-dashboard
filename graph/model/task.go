package model

import "time"

type Task struct {
	ID             int       `json:"id" db:"id"`
	InitiatedByID  *int      `json:"initiatedByID,omitempty" db:"initiated_by"`
	UpdateTime     time.Time `json:"updateTime" db:"update_time"`
	PostedTime     time.Time `json:"postedTime" db:"posted_time"`
	OwnerID        *int      `json:"ownerId,omitempty" db:"owner_id"`
	AddedByID      int       `json:"addedByID" db:"added_by"`
	PreviousTaskID *int      `json:"previousTaskID,omitempty" db:"previous_task"`
	Name           string    `json:"name"`
}
