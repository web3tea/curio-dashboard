package types

import (
	"database/sql"
	"io"
	"strconv"
)

type NullString struct {
	sql.NullString
}

func MustNullString(v any) NullString {
	b := NullString{}
	b.Scan(v) // nolint: errcheck
	return b
}

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (b *NullString) UnmarshalGQL(v any) error {
	return b.Scan(v)
}

// MarshalGQL implements the graphql.Marshaler interface
func (b NullString) MarshalGQL(w io.Writer) {
	io.WriteString(w, strconv.Quote(b.String)) // nolint: errcheck
}

type NullInt64 struct {
	sql.NullInt64
}

func MustNullInt64(v any) NullInt64 {
	b := NullInt64{}
	b.Scan(v) // nolint: errcheck
	return b
}

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (b *NullInt64) UnmarshalGQL(v any) error {
	return b.Scan(v)
}

// MarshalGQL implements the graphql.Marshaler interface
func (b NullInt64) MarshalGQL(w io.Writer) {
	io.WriteString(w, strconv.FormatInt(b.Int64, 10)) // nolint: errcheck
}

type NullBool struct {
	sql.NullBool
}

func MustNullBool(v any) NullBool {
	b := NullBool{}
	b.Scan(v) // nolint: errcheck
	return b
}

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (b *NullBool) UnmarshalGQL(v any) error {
	return b.Scan(v)
}

// MarshalGQL implements the graphql.Marshaler interface
func (b NullBool) MarshalGQL(w io.Writer) {
	io.WriteString(w, strconv.FormatBool(b.Bool)) // nolint: errcheck
}
