package types

import (
	"encoding/json"
	"fmt"
	"io"
)

type JSON struct {
	json.RawMessage
}

func MustJSON(v any) JSON {
	j, err := ToJSON(v)
	if err != nil {
		return JSON{}
	}
	return j
}

func ToJSON(v any) (JSON, error) {
	switch v := v.(type) {
	case nil:
		return JSON{}, nil
	case JSON:
		return v, nil
	case json.RawMessage:
		return JSON{RawMessage: v}, nil
	case []byte:
		if !json.Valid(v) {
			return JSON{}, fmt.Errorf("invalid JSON bytes")
		}
		return JSON{RawMessage: v}, nil
	case string:
		if !json.Valid([]byte(v)) {
			return JSON{}, fmt.Errorf("invalid JSON string")
		}
		return JSON{RawMessage: json.RawMessage(v)}, nil
	default:
		bytes, err := json.Marshal(v)
		if err != nil {
			return JSON{}, err
		}
		return JSON{RawMessage: bytes}, nil
	}
}

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (c *JSON) UnmarshalGQL(v any) error {
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

func (c JSON) MarshalGQL(w io.Writer) {
	if c.RawMessage == nil {
		w.Write([]byte("null")) // nolint: errcheck
		return
	}
	w.Write([]byte(c.RawMessage)) // nolint: errcheck
}
