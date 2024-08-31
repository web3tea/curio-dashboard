package curiorpc

import (
	"context"
	"net/http"

	"github.com/filecoin-project/go-jsonrpc"
	"github.com/filecoin-project/lotus/api"
)

func NewWebRPCV0(ctx context.Context, addr string, requestHeader http.Header) (WebRPC, jsonrpc.ClientCloser, error) {
	var res WebRPCStruct
	closer, err := jsonrpc.NewMergeClient(ctx, addr, "CurioWeb",
		api.GetInternalStructs(&res), requestHeader, jsonrpc.WithErrors(api.RPCErrors))

	return &res, closer, err
}
