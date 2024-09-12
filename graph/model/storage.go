package model

import "time"

type StoragePath struct {
	StorageID     string    `json:"storageId"`
	Urls          string    `json:"urls"`
	Weight        int       `json:"weight"`
	MaxStorage    int       `json:"maxStorage"`
	CanSeal       bool      `json:"canSeal"`
	CanStore      bool      `json:"canStore"`
	Groups        *string   `json:"groups"`
	AllowTo       *string   `json:"allowTo"`
	AllowTypes    *string   `json:"allowTypes"`
	DenyTypes     *string   `json:"denyTypes"`
	Capacity      int       `json:"capacity"`
	Available     int       `json:"available"`
	FsAvailable   int       `json:"fsAvailable"`
	Reserved      int       `json:"reserved"`
	Used          int       `json:"used"`
	LastHeartbeat time.Time `json:"lastHeartbeat"`
	HeartbeatErr  *string   `json:"heartbeatErr"`
	AllowMiners   string    `json:"allowMiners"`
	DenyMiners    string    `json:"denyMiners"`
}
