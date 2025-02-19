package types

import (
	"encoding/json"
	"fmt"
	"io"
)

type JSONB struct {
	json.RawMessage
}

func MustJSONB(v interface{}) JSONB {
	j, err := ToJSONB(v)
	if err != nil {
		return JSONB{}
	}
	return j
}

func ToJSONB(v interface{}) (JSONB, error) {
	switch v := v.(type) {
	case nil:
		return JSONB{}, nil
	case JSONB:
		return v, nil
	case json.RawMessage:
		return JSONB{RawMessage: v}, nil
	case []byte:
		if !json.Valid(v) {
			return JSONB{}, fmt.Errorf("invalid JSON bytes")
		}
		return JSONB{RawMessage: v}, nil
	case string:
		if !json.Valid([]byte(v)) {
			return JSONB{}, fmt.Errorf("invalid JSON string")
		}
		return JSONB{RawMessage: json.RawMessage(v)}, nil
	default:
		bytes, err := json.Marshal(v)
		if err != nil {
			return JSONB{}, err
		}
		return JSONB{RawMessage: bytes}, nil
	}
}

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (c *JSONB) UnmarshalGQL(v interface{}) error {
	if v == nil {
		c.RawMessage = nil
		return nil
	}

	switch v := v.(type) {
	case string:
		fmt.Println("2222", v)
		c.RawMessage = json.RawMessage(v)
	case []byte:
		fmt.Println("33333", v)
		c.RawMessage = json.RawMessage(v)
	default:
		fmt.Println("11111", v)
		bytes, err := json.Marshal(v)
		if err != nil {
			return err
		}
		c.RawMessage = json.RawMessage(bytes)
	}
	return nil
}

func (c JSONB) MarshalGQL(w io.Writer) {
	if c.RawMessage == nil {
		w.Write([]byte("null")) // nolint: errcheck
		return
	}
	w.Write([]byte(c.RawMessage)) // nolint: errcheck
}
