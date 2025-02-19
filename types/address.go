package types

import (
	"database/sql/driver"
	"fmt"
	"io"
	"reflect"
	"strconv"

	"github.com/filecoin-project/go-address"
)

type Address struct {
	address.Address
	ID uint64
}

func MustParseAddress(addr string) Address {
	if a, err := NewFromString(addr); err != nil {
		return Address{}
	} else {
		return a
	}
}

func NewFromString(addr string) (Address, error) {
	a, err := address.NewFromString(addr)
	if err != nil {
		return Address{}, err
	}
	v := Address{Address: a}
	if a.Protocol() == address.ID {
		id, err := address.IDFromAddress(a)
		if err != nil {
			return Address{}, err
		}
		v.ID = id
	}
	return v, nil
}

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (b *Address) UnmarshalGQL(v interface{}) error {
	switch value := v.(type) {
	case string:
		addr, err := address.NewFromString(value)
		if err != nil {
			return fmt.Errorf("invalid address: %w", err)
		}
		aid, err := address.IDFromAddress(addr)
		if err != nil { // nolint: staticcheck
			// ignore error
		}
		*b = Address{Address: addr, ID: aid}
	case int, uint, int64, uint64:
		val := reflect.ValueOf(value).Convert(reflect.TypeOf(uint64(0))).Uint()
		addr, err := address.NewIDAddress(val)
		if err != nil {
			return fmt.Errorf("invalid address: %w", err)
		}
		*b = Address{Address: addr, ID: val}
	default:
		return fmt.Errorf("invalid address: %v", v)
	}
	return nil
}

// MarshalGQL implements the graphql.Marshaler interface
func (b Address) MarshalGQL(w io.Writer) {
	io.WriteString(w, strconv.Quote(b.String())) // nolint: errcheck
}

func (b *Address) Scan(value interface{}) error {
	return b.UnmarshalGQL(value)
}

// Value return json value, implement driver.Valuer interface
func (b Address) Value() (driver.Value, error) {
	return b.String(), nil
}
