package types

import (
	"database/sql/driver"
	"encoding/base64"
	"fmt"
	"io"
)

type ByteArray []byte

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (b *ByteArray) UnmarshalGQL(v interface{}) error {
	switch value := v.(type) {
	case string: // for graphql
		arr, err := base64.StdEncoding.DecodeString(value)
		if err != nil {
			return fmt.Errorf("ByteArray must be valid base64: %w", err)
		}
		*b = arr
	case []byte: // for database
		*b = value
	case nil:
		*b = nil
	default:
		return fmt.Errorf("invalid ByteArray: %v", v)
	}
	return nil
}

// MarshalGQL implements the graphql.Marshaler interface
func (b ByteArray) MarshalGQL(w io.Writer) {
	jsonStr := fmt.Sprintf(`"%s"`, base64.StdEncoding.EncodeToString(b))
	_, _ = w.Write([]byte(jsonStr)) // nolint: errcheck
}

func (b *ByteArray) Scan(value interface{}) error {
	return b.UnmarshalGQL(value)
}

// Value return json value, implement driver.Valuer interface
func (b ByteArray) Value() (driver.Value, error) {
	jsonStr := fmt.Sprintf(`"%s"`, base64.StdEncoding.EncodeToString(b))
	return jsonStr, nil
}
