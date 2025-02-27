package types

import (
	"database/sql/driver"
	"fmt"
	"io"
	"strconv"

	"github.com/ipfs/go-cid"
)

type Cid struct {
	cid.Cid
}

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (b *Cid) UnmarshalGQL(v interface{}) error {
	c, err := cid.Parse(v)
	if err != nil {
		return fmt.Errorf("invalid cid: %w", err)
	}
	*b = Cid{Cid: c}
	return nil
}

// MarshalGQL implements the graphql.Marshaler interface
func (b Cid) MarshalGQL(w io.Writer) {
	io.WriteString(w, strconv.Quote(b.String())) // nolint: errcheck
}

func (b *Cid) Scan(value interface{}) error {
	return b.UnmarshalGQL(value)
}

// Value return json value, implement driver.Valuer interface
func (b Cid) Value() (driver.Value, error) {
	return b.String(), nil
}
