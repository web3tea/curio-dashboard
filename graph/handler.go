package graph

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/samber/lo"
	"github.com/vektah/gqlparser/v2/ast"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/gorilla/websocket"
	logging "github.com/ipfs/go-log/v2"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"github.com/web3tea/curio-dashboard/config"
	"github.com/web3tea/curio-dashboard/graph/cachecontrol"
	"github.com/web3tea/curio-dashboard/graph/model"
)

var log = logging.Logger("graph")

func Router(r *chi.Mux, cfg *config.Config, resolver ResolverRoot) {
	ah := authHandler{cfg: cfg}
	r.Post("/auth/token", ah.Login)
	r.Handle("/graphql", graphHandler(cfg, resolver))
}

func graphHandler(cfg *config.Config, resolver ResolverRoot) http.Handler {
	c := Config{Resolvers: resolver}
	c.Directives.HasRole = func(ctx context.Context, obj any, next graphql.Resolver, role model.Role) (res any, err error) {
		if cfg.Auth.Secret == "" {
			return next(ctx)
		}
		if hasRole(ctx, role) {
			return next(ctx)
		}
		return nil, fmt.Errorf("access denied: %s role required", role)
	}
	srv := handler.New(NewExecutableSchema(c))
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
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
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

	srv.SetRecoverFunc(func(ctx context.Context, err any) error {
		log.Error(err)
		return gqlerror.Errorf("internal server error")
	})

	return srv
}

func webSocketInit(ctx context.Context, cfg *config.Config, initPayload transport.InitPayload) (context.Context, *transport.InitPayload, error) {
	tokenKey := initPayload["authToken"]
	tokenString, ok := tokenKey.(string)
	if !ok || tokenString == "" {
		return nil, nil, errors.New("authToken not found in transport payload")
	}

	user, err := ValidateToken(tokenString, cfg.Auth.Secret, cfg.Auth.Users)
	if err != nil {
		log.Warnf("failed to validate token: %s", err)
		return nil, nil, err
	}

	// put it in context
	ctxNew := context.WithValue(ctx, userKey{}, user)

	return ctxNew, &transport.InitPayload{
		"message": fmt.Sprintf("Hello, %s", user.Username),
	}, nil
}

func FindUser(users []config.UserConfig, username string) (*UserContext, error) {
	for _, u := range users {
		if u.Username == username {
			return &UserContext{
				Username: u.Username,
				Role:     lo.If(model.Role(u.Role).IsValid(), model.Role(u.Role)).Else(model.RoleUser),
			}, nil
		}
	}
	return nil, fmt.Errorf("user %s not found", username)
}

func hasRole(ctx context.Context, role model.Role) bool {
	if ctx == nil {
		return false
	}
	user, ok := ctx.Value(userKey{}).(*UserContext)
	if !ok {
		return false
	}
	return user.Role.IsValid() && lo.IndexOf(model.AllRole, user.Role) >= lo.IndexOf(model.AllRole, role)
}
