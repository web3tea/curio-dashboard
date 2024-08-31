package curiorpc

import (
	"context"
	"net/http"
	"reflect"
	"time"

	"github.com/filecoin-project/go-jsonrpc"
	"github.com/filecoin-project/lotus/api"
	"github.com/filecoin-project/lotus/lib/retry"
)

type contextKey string

func NewWebRPCV0(ctx context.Context, addr string, requestHeader http.Header) (WebRPC, jsonrpc.ClientCloser, error) {
	var res WebRPCStruct
	closer, err := jsonrpc.NewMergeClient(ctx, addr, "CurioWeb",
		api.GetInternalStructs(&res), requestHeader, jsonrpc.WithErrors(api.RPCErrors))

	return &res, closer, err
}

func WebRPCProxy[T WebRPC](ins []T, outStr *WebRPCStruct) {
	outs := api.GetInternalStructs(outStr)

	var rIns []reflect.Value
	for _, in := range ins {
		rIns = append(rIns, reflect.ValueOf(in))
	}

	for _, out := range outs {
		rProxyInternal := reflect.ValueOf(out).Elem()

		for f := 0; f < rProxyInternal.NumField(); f++ {
			field := rProxyInternal.Type().Field(f)

			var fns []reflect.Value
			for _, rin := range rIns {
				fns = append(fns, rin.MethodByName(field.Name))
			}

			rProxyInternal.Field(f).Set(reflect.MakeFunc(field.Type, func(args []reflect.Value) (results []reflect.Value) {
				errorsToRetry := []error{&jsonrpc.RPCConnectionError{}, &jsonrpc.ErrClient{}}
				initialBackoff, err := time.ParseDuration("1s")
				if err != nil {
					return nil
				}

				ctx := args[0].Interface().(context.Context)

				curr := -1

				// for calls that need to be performed on the same node
				// primarily for miner when calling create block and submit block subsequently
				key := contextKey("retry-node")
				if ctx.Value(key) != nil {
					if (*ctx.Value(key).(**int)) == nil {
						*ctx.Value(key).(**int) = &curr
					} else {
						curr = **ctx.Value(key).(**int) - 1
					}
				}

				total := len(rIns)
				result, _ := retry.Retry(ctx, 5, initialBackoff, errorsToRetry, func() ([]reflect.Value, error) {
					curr = (curr + 1) % total

					result := fns[curr].Call(args)
					if result[len(result)-1].IsNil() {
						return result, nil
					}
					e := result[len(result)-1].Interface().(error)
					return result, e
				})
				return result
			}))
		}
	}
}
