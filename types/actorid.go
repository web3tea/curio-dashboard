package types

import (
	"database/sql/driver"
	"fmt"
	"io"
	"strconv"

	"github.com/filecoin-project/go-address"
)

type ActorID struct {
	ID uint64
}

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (b *ActorID) UnmarshalGQL(v interface{}) error {
	switch value := v.(type) {
	case string:
		val, err := strconv.ParseUint(value, 10, 64)
		if err != nil {
			return fmt.Errorf("invalid actor id: %w", err)
		}
		*b = ActorID{ID: val}
	case int:
		*b = ActorID{ID: uint64(value)}
	case uint:
		*b = ActorID{ID: uint64(value)}
	case int64:
		*b = ActorID{ID: uint64(value)}
	case uint64:
		*b = ActorID{ID: value}
	default:
		return fmt.Errorf("invalid actor id: %v", v)
	}
	return nil
}

// MarshalGQL implements the graphql.Marshaler interface
func (b ActorID) MarshalGQL(w io.Writer) {
	addr, _ := address.NewIDAddress(b.ID)             // nolint: errcheck
	_, _ = w.Write([]byte(`"` + addr.String() + `"`)) // nolint: errcheck
}

func (b *ActorID) Scan(value interface{}) error {
	return b.UnmarshalGQL(value)
}

// Value return json value, implement driver.Valuer interface
func (b ActorID) Value() (driver.Value, error) {
	return int64(b.ID), nil
}
