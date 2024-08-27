package types

import (
	"encoding/json"
	"fmt"
	"io"
)

type JSONB []byte

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (b *JSONB) UnmarshalGQL(v interface{}) error {
	switch value := v.(type) {
	case nil:
		return nil
	case string:
		*b = JSONB(value)
	case []byte:
		*b = value
	case map[string]interface{}:
		jsonBytes, err := json.Marshal(value)
		if err != nil {
			return fmt.Errorf("invalid JSONB: %v", err)
		}
		*b = jsonBytes
	default:
		return fmt.Errorf("invalid JSONB: %v", v)
	}
	return nil
}

// MarshalGQL implements the graphql.Marshaler interface
func (b JSONB) MarshalGQL(w io.Writer) {
	_, _ = w.Write(b) // nolint: errcheck
}

func (b *JSONB) Scan(value interface{}) error {
	return b.UnmarshalGQL(value)
}
