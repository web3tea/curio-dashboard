package graph

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/vektah/gqlparser/v2/ast"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/golang-jwt/jwt"
	"github.com/gorilla/websocket"
	logging "github.com/ipfs/go-log/v2"
	"github.com/labstack/echo/v4"
	"github.com/strahe/curio-dashboard/config"
	"github.com/strahe/curio-dashboard/graph/cachecontrol"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

var log = logging.Logger("graph")

func Router(e *echo.Echo, cfg *config.Config, resolver ResolverRoot) error {
	ah := authHandler{cfg: cfg}
	e.POST("/auth/token", ah.Login)

	group := e.Group("/graphql")
	group.Match([]string{"GET"}, "", graphHandler(cfg, resolver))

	return nil
}

func graphHandler(cfg *config.Config, resolver ResolverRoot) echo.HandlerFunc {
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
					"variables", oc.Variables)
			}
		}
		return ns
	})

	// log errors
	srv.SetErrorPresenter(func(ctx context.Context, e error) *gqlerror.Error {
		err := graphql.DefaultErrorPresenter(ctx, e)
		if err != nil {
			log.Errorw("request", "path", err.Path.String(), "error", err)
		}
		return err
	})

	srv.SetRecoverFunc(func(ctx context.Context, err interface{}) error {
		log.Error(err)
		return gqlerror.Errorf("internal server error")
	})

	return echo.WrapHandler(srv)
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
