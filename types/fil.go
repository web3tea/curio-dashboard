package types

import (
	"database/sql/driver"
	"fmt"
	"io"
	"strconv"

	"github.com/filecoin-project/lotus/chain/types"
)

type FIL struct {
	types.FIL
}

func MustParseFIL(s string) FIL {
	fil, err := types.ParseFIL(s)
	if err != nil {
		panic(err)
	}
	return FIL{FIL: fil}
}

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (b *FIL) UnmarshalGQL(v interface{}) error {
	switch value := v.(type) {
	case string:
		fil, err := types.ParseFIL(value)
		if err != nil {
			return fmt.Errorf("invalid FIL: %w", err)
		}
		*b = FIL{FIL: fil}
	default:
		return fmt.Errorf("invalid FIL: %v", v)
	}
	return nil
}

// MarshalGQL implements the graphql.Marshaler interface
func (b FIL) MarshalGQL(w io.Writer) {
	io.WriteString(w, strconv.Quote(b.String())) // nolint: errcheck
}

func (b *FIL) Scan(value interface{}) error {
	return b.UnmarshalGQL(value)
}

// Value return json value, implement driver.Valuer interface
func (b FIL) Value() (driver.Value, error) {
	return b.String(), nil
}
