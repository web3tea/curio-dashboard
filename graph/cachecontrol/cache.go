package cachecontrol

import (
	"context"
	"sync"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/vektah/gqlparser/v2/ast"
)

type Scope string

const (
	ScopePublic  = Scope("PUBLIC")
	ScopePrivate = Scope("PRIVATE")
)

type Hint struct {
	Path   ast.Path `json:"path"`
	MaxAge float64  `json:"maxAge"`
	Scope  Scope    `json:"scope"`
}

type OverallCachePolicy struct {
	MaxAge float64
	Scope  Scope
}

type CacheControl struct {
	Version int    `json:"version"`
	Hints   []Hint `json:"hints"`
	mu      sync.Mutex
}

func (cache *CacheControl) AddHint(h Hint) {
	cache.mu.Lock()
	defer cache.mu.Unlock()
	cache.Hints = append(cache.Hints, h)
}

// OverallPolicy return a calculated cache policy
func (cache *CacheControl) OverallPolicy() OverallCachePolicy {
	var (
		scope     = ScopePublic
		maxAge    float64
		hasMaxAge bool
	)

	for _, c := range cache.Hints {

		if c.Scope == ScopePrivate {
			scope = c.Scope
		}

		if !hasMaxAge || c.MaxAge < maxAge {
			hasMaxAge = true
			maxAge = c.MaxAge
		}
	}

	return OverallCachePolicy{
		MaxAge: maxAge,
		Scope:  scope,
	}
}

type cacheControlKey struct{}

var cacheControlContextKey = cacheControlKey{}

func WithCacheControlExtension(ctx context.Context) context.Context {
	cache := &CacheControl{Version: 1}
	return context.WithValue(ctx, cacheControlContextKey, cache)
}

func GetCacheControl(ctx context.Context) *CacheControl {
	c := ctx.Value(cacheControlContextKey)
	if c, ok := c.(*CacheControl); ok {
		return c
	}

	return nil
}

func SetHint(ctx context.Context, scope Scope, maxAge time.Duration) {
	c := ctx.Value(cacheControlContextKey)
	if c, ok := c.(*CacheControl); ok {
		c.AddHint(Hint{
			Path:   graphql.GetFieldContext(ctx).Path(),
			MaxAge: maxAge.Seconds(),
			Scope:  scope,
		})
	}
}
