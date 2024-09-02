package graph

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	logging "github.com/ipfs/go-log/v2"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/golang-jwt/jwt"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/strahe/curio-dashboard/config"
	"github.com/strahe/curio-dashboard/graph/cachecontrol"
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
	var srv = handler.New(NewExecutableSchema(Config{Resolvers: resolver}))
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
	//srv.AddTransport(transport.Options{})
	//srv.AddTransport(transport.GET{})
	//srv.AddTransport(transport.POST{})
	//srv.AddTransport(transport.MultipartForm{})
	srv.SetQueryCache(lru.New(1000))
	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New(100),
	})
	srv.Use(cachecontrol.Extension{})
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
