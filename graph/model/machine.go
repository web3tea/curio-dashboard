package model

import "time"

type Machine struct {
	ID          int       `json:"id" db:"id"`
	LastContact time.Time `json:"lastContact" db:"last_contact"`
	HostAndPort string    `json:"hostAndPort" db:"host_and_port"`
	CPU         int       `json:"cpu" db:"cpu"`
	RAM         int       `json:"ram" db:"ram"`
	Gpu         float64   `json:"gpu" db:"gpu"`
}
