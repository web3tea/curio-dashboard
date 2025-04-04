package prometheus

import (
	"context"
	"encoding/json"
	"net/url"
	"strconv"
	"time"
)

const (
	apiPrefix = "/api/v1"

	epQuery      = apiPrefix + "/query"
	epQueryRange = apiPrefix + "/query_range"
)

// Range represents a sliced time range.
type Range struct {
	// The boundaries of the time range.
	Start, End time.Time
	// The maximum time between two slices within the boundaries.
	Step time.Duration
}

// StatsValue is a type for `stats` query parameter.
type StatsValue string

// AllStatsValue is the query parameter value to return all the query statistics.
const (
	AllStatsValue StatsValue = "all"
)

type API interface {
	Query(ctx context.Context, query string, ts time.Time, opts ...Option) (json.RawMessage, Warnings, error)
	QueryRange(ctx context.Context, query string, r Range, opts ...Option) (json.RawMessage, Warnings, error)
}

type apiOptions struct {
	timeout       time.Duration
	lookbackDelta time.Duration
	stats         StatsValue
	limit         uint64
}

type Option func(c *apiOptions)

// WithTimeout can be used to provide an optional query evaluation timeout for Query and QueryRange.
// https://prometheus.io/docs/prometheus/latest/querying/api/#instant-queries
func WithTimeout(timeout time.Duration) Option {
	return func(o *apiOptions) {
		o.timeout = timeout
	}
}

// WithLookbackDelta can be used to provide an optional query lookback delta for Query and QueryRange.
// This URL variable is not documented on Prometheus HTTP API.
// https://github.com/prometheus/prometheus/blob/e04913aea2792a5c8bc7b3130c389ca1b027dd9b/promql/engine.go#L162-L167
func WithLookbackDelta(lookbackDelta time.Duration) Option {
	return func(o *apiOptions) {
		o.lookbackDelta = lookbackDelta
	}
}

// WithStats can be used to provide an optional per step stats for Query and QueryRange.
// This URL variable is not documented on Prometheus HTTP API.
// https://github.com/prometheus/prometheus/blob/e04913aea2792a5c8bc7b3130c389ca1b027dd9b/promql/engine.go#L162-L167
func WithStats(stats StatsValue) Option {
	return func(o *apiOptions) {
		o.stats = stats
	}
}

// WithLimit provides an optional maximum number of returned entries for APIs that support limit parameter
// e.g. https://prometheus.io/docs/prometheus/latest/querying/api/#instant-querie:~:text=%3A%20End%20timestamp.-,limit%3D%3Cnumber%3E,-%3A%20Maximum%20number%20of
func WithLimit(limit uint64) Option {
	return func(o *apiOptions) {
		o.limit = limit
	}
}

func NewAPI(c Client) API {
	return &httpAPI{
		client: &apiClientImpl{
			client: c,
		},
	}
}

type httpAPI struct {
	client apiClient
}

func (h *httpAPI) Query(ctx context.Context, query string, ts time.Time, opts ...Option) (json.RawMessage, Warnings, error) {
	u := h.client.URL(epQuery, nil)
	q := addOptionalURLParams(u.Query(), opts)

	q.Set("query", query)
	if !ts.IsZero() {
		q.Set("time", formatTime(ts))
	}

	_, body, warnings, err := h.client.DoGetFallback(ctx, u, q)
	if err != nil {
		return nil, warnings, err
	}

	return body, warnings, nil
}

func (h *httpAPI) QueryRange(ctx context.Context, query string, r Range, opts ...Option) (json.RawMessage, Warnings, error) {
	u := h.client.URL(epQueryRange, nil)
	q := addOptionalURLParams(u.Query(), opts)

	q.Set("query", query)
	q.Set("start", formatTime(r.Start))
	q.Set("end", formatTime(r.End))
	q.Set("step", strconv.FormatFloat(r.Step.Seconds(), 'f', -1, 64))

	_, body, warnings, err := h.client.DoGetFallback(ctx, u, q)
	if err != nil {
		return nil, warnings, err
	}
	return body, warnings, nil
}

var _ API = &httpAPI{}

func addOptionalURLParams(q url.Values, opts []Option) url.Values {
	opt := &apiOptions{}
	for _, o := range opts {
		o(opt)
	}

	if opt.timeout > 0 {
		q.Set("timeout", opt.timeout.String())
	}

	if opt.lookbackDelta > 0 {
		q.Set("lookback_delta", opt.lookbackDelta.String())
	}

	if opt.stats != "" {
		q.Set("stats", string(opt.stats))
	}

	if opt.limit > 0 {
		q.Set("limit", strconv.FormatUint(opt.limit, 10))
	}

	return q
}

func formatTime(t time.Time) string {
	return strconv.FormatFloat(float64(t.Unix())+float64(t.Nanosecond())/1e9, 'f', -1, 64)
}
