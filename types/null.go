package types

import (
	"database/sql"
	"io"

	"github.com/99designs/gqlgen/graphql"
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
	graphql.MarshalString(b.String).MarshalGQL(w)
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
	graphql.MarshalInt64(b.Int64).MarshalGQL(w)
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
	graphql.MarshalBoolean(b.Bool).MarshalGQL(w)
}

type NullTime struct {
	sql.NullTime
}

func MustNullTime(v any) NullTime {
	b := NullTime{}
	b.Scan(v) // nolint: errcheck
	return b
}

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (b *NullTime) UnmarshalGQL(v any) error {
	return b.Scan(v)
}

// MarshalGQL implements the graphql.Marshaler interface
func (b NullTime) MarshalGQL(w io.Writer) {
	graphql.MarshalTime(b.Time).MarshalGQL(w)
}
