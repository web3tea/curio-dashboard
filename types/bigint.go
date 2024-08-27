package types

import (
	"database/sql/driver"
	"fmt"
	"io"
	"math/big"
)

type BigInt struct {
	*big.Int
}

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (b *BigInt) UnmarshalGQL(v interface{}) error {
	switch value := v.(type) {
	case string:
		v := big.Int{}
		v.SetString(value, 10)
		*b = BigInt{&v}
	default:
		return fmt.Errorf("invalid bigint: %v", v)
	}
	return nil
}

// MarshalGQL implements the graphql.Marshaler interface
func (b BigInt) MarshalGQL(w io.Writer) {
	_, _ = w.Write([]byte(b.String())) // nolint: errcheck
}

func (b *BigInt) Scan(value interface{}) error {
	return b.UnmarshalGQL(value)
}

// Value return json value, implement driver.Valuer interface
func (b BigInt) Value() (driver.Value, error) {
	return b.String(), nil
}
