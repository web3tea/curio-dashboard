package types

import (
	"database/sql/driver"
	"fmt"
	"io"

	"github.com/filecoin-project/go-address"
)

type Address struct {
	address.Address
}

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (b *Address) UnmarshalGQL(v interface{}) error {
	switch value := v.(type) {
	case string:
		addr, err := address.NewFromString(value)
		if err != nil {
			return fmt.Errorf("invalid address: %w", err)
		}
		*b = Address{addr}
	default:
		return fmt.Errorf("invalid address: %v", v)
	}
	return nil
}

// MarshalGQL implements the graphql.Marshaler interface
func (b Address) MarshalGQL(w io.Writer) {
	_, _ = w.Write([]byte(`"` + b.String() + `"`)) // nolint: errcheck
}

func (b *Address) Scan(value interface{}) error {
	return b.UnmarshalGQL(value)
}

// Value return json value, implement driver.Valuer interface
func (b Address) Value() (driver.Value, error) {
	return b.String(), nil
}
