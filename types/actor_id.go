package types

import (
	"database/sql/driver"
	"fmt"
	"io"

	"github.com/filecoin-project/go-address"
)

type ActorID uint64

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (b *ActorID) UnmarshalGQL(v interface{}) error {
	switch value := v.(type) {
	case int:
		*b = ActorID(value)
	case int64:
		*b = ActorID(value)
	case uint64:
		*b = ActorID(value)
	case string:
		addr, err := address.NewFromString(value)
		if err != nil {
			return fmt.Errorf("invalid actor id: %w", err)
		}
		aid, err := address.IDFromAddress(addr)
		if err != nil {
			return fmt.Errorf("invalid actor id: %w", err)
		}
		*b = ActorID(aid)
	default:
		return fmt.Errorf("invalid actor id type: %s", value)
	}
	return nil
}

// MarshalGQL implements the graphql.Marshaler interface
func (b ActorID) MarshalGQL(w io.Writer) {
	addr, err := address.NewIDAddress(uint64(b))
	if err != nil {
		_, _ = w.Write([]byte(`"invalid"`)) // nolint: errcheck
		return
	}
	_, _ = w.Write([]byte(`"` + addr.String() + `"`)) // nolint: errcheck
}

func (b *ActorID) Scan(value interface{}) error {
	return b.UnmarshalGQL(value)
}

// Value return json value, implement driver.Valuer interface
func (b ActorID) Value() (driver.Value, error) {
	return int(b), nil
}
