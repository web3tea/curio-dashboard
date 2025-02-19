package types

import (
	"database/sql/driver"
	"fmt"
	"io"
	"strconv"

	"github.com/libp2p/go-libp2p/core/peer"
)

type PeerID struct {
	*peer.ID
}

func MustParsePeerID(s string) PeerID {
	pid, err := peer.Decode(s)
	if err != nil {
		panic(err)
	}
	return PeerID{ID: &pid}
}

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (b *PeerID) UnmarshalGQL(v interface{}) error {
	switch value := v.(type) {
	case string:
		pid, err := peer.Decode(value)
		if err != nil {
			return fmt.Errorf("invalid PeerID: %w", err)
		}
		*b = PeerID{ID: &pid}
	case []byte:
		pid, err := peer.IDFromBytes(value)
		if err != nil {
			return fmt.Errorf("invalid PeerID: %w", err)
		}
		*b = PeerID{ID: &pid}
	}
	return fmt.Errorf("invalid PeerID: %v", v)
}

// MarshalGQL implements the graphql.Marshaler interface
func (b PeerID) MarshalGQL(w io.Writer) {
	io.WriteString(w, strconv.Quote(b.String())) // nolint: errcheck
}

func (b *PeerID) Scan(value interface{}) error {
	return b.UnmarshalGQL(value)
}

// Value return json value, implement driver.Valuer interface
func (b PeerID) Value() (driver.Value, error) {
	return b.String(), nil
}
