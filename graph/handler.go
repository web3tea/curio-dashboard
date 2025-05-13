package graph

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/vektah/gqlparser/v2/ast"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/golang-jwt/jwt"
	"github.com/gorilla/websocket"
	logging "github.com/ipfs/go-log/v2"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"github.com/web3tea/curio-dashboard/config"
	"github.com/web3tea/curio-dashboard/graph/cachecontrol"
)

var log = logging.Logger("graph")

func Router(r *chi.Mux, cfg *config.Config, resolver ResolverRoot) {
	ah := authHandler{cfg: cfg}
	r.Post("/auth/token", ah.Login)
	r.Handle("/graphql", graphHandler(cfg, resolver))
}

func graphHandler(cfg *config.Config, resolver ResolverRoot) http.Handler {
	srv := handler.New(NewExecutableSchema(Config{Resolvers: resolver}))
	if cfg.Auth.Secret != "" {
		log.Infof("JWT secret is set, graphql authentication is enabled")
	} else {
		log.Warnf("JWT secret is not set, graphql authentication is disabled")
	}
	srv.AddTransport(transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			}, // allow all connections by default,
		},
		InitFunc: func(ctx context.Context, initPayload transport.InitPayload) (context.Context, *transport.InitPayload, error) {
			if cfg.Auth.Secret == "" {
				return ctx, nil, nil
			} else {
				ctx, payload, err := webSocketInit(ctx, cfg, initPayload)
				if err != nil {
					log.Warnf("websocket init failed: %s", err)
				}
				return ctx, payload, err
			}
		},
	})
	// srv.AddTransport(transport.Options{})
	// srv.AddTransport(transport.GET{})
	// srv.AddTransport(transport.POST{})
	// srv.AddTransport(transport.MultipartForm{})
	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))
	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})
	srv.Use(cachecontrol.Extension{})

	// log requests
	srv.AroundResponses(func(ctx context.Context, next graphql.ResponseHandler) *graphql.Response {
		oc := graphql.GetOperationContext(ctx)
		ns := next(ctx)

		if oc != nil && ns != nil {
			if !strings.HasPrefix(oc.OperationName, "Sub") {
				log.Debugw("request", "operation", oc.OperationName,
					"duration", time.Since(oc.Stats.OperationStart).String(),
					"variables", oc.Variables, "error", ns.Errors.Error())
			}
		}
		return ns
	})

	// log errors
	srv.SetErrorPresenter(func(ctx context.Context, e error) *gqlerror.Error {
		err := graphql.DefaultErrorPresenter(ctx, e)
		if err != nil {
			log.Errorw("request", "path", err.Path.String(), "error", err.Message)
		}
		return err
	})

	srv.SetRecoverFunc(func(ctx context.Context, err interface{}) error {
		log.Error(err)
		return gqlerror.Errorf("internal server error")
	})

	return srv
}

type userKey struct{}

func webSocketInit(ctx context.Context, cfg *config.Config, initPayload transport.InitPayload) (context.Context, *transport.InitPayload, error) {
	tokenKey := initPayload["authToken"]
	token, ok := tokenKey.(string)
	if !ok || token == "" {
		return nil, nil, errors.New("authToken not found in transport payload")
	}

	tc, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(cfg.Auth.Secret), nil
	})
	if err != nil {
		return nil, nil, fmt.Errorf("failed to parse token: %w", err)
	}
	if !tc.Valid {
		return nil, nil, fmt.Errorf("invalid token")
	}
	claim := tc.Claims.(jwt.MapClaims)

	username := claim["username"].(string)

	// put it in context
	ctxNew := context.WithValue(ctx, userKey{}, username)

	return ctxNew, &transport.InitPayload{
		"message": fmt.Sprintf("Hello, %s", username),
	}, nil
}
