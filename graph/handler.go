package graph

import (
	"context"
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

func getClientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		ips := strings.Split(xff, ",")
		if len(ips) > 0 {
			return strings.TrimSpace(ips[0])
		}
	}

	if xri := r.Header.Get("X-Real-IP"); xri != "" {
		return strings.TrimSpace(xri)
	}

	if cfip := r.Header.Get("CF-Connecting-IP"); cfip != "" {
		return strings.TrimSpace(cfip)
	}

	ip := r.RemoteAddr
	if colonIndex := strings.LastIndex(ip, ":"); colonIndex != -1 {
		ip = ip[:colonIndex]
	}
	ip = strings.Trim(ip, "[]")
	return ip
}

func Router(r *chi.Mux, cfg *config.Config, resolver ResolverRoot) {
	ah := authHandler{cfg: cfg}
	r.Post("/auth/token", ah.Login)
	r.With(TokenExtractMiddleware(cfg)).Handle("/graphql", graphHandler(cfg, resolver))
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
				fields := []any{
					"op", oc.OperationName,
					"dur", time.Since(oc.Stats.OperationStart).String(),
					"vars", oc.Variables,
				}

				if req, ok := ctx.Value(requestKey{}).(*http.Request); ok {
					fields = append(fields, "ip", getClientIP(req))
				}

				if len(ns.Errors) > 0 {
					fields = append(fields, "err", ns.Errors.Error())
				}

				log.Debugw("request", fields...)
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
		return nil, nil, fmt.Errorf("no token found in init payload")
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
			ur := strings.ToUpper(u.Role)
			return &UserContext{
				Username: u.Username,
				Role:     lo.If(model.Role(ur).IsValid(), model.Role(ur)).Else(model.RoleUser),
			}, nil
		}
	}
	return nil, fmt.Errorf("user not found: %s", username)
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

func TokenExtractMiddleware(cfg *config.Config) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if cfg.Auth.Secret == "" {
				log.Debugf("Authentication secret is not set, skipping authentication")
				// Authentication disabled
				next.ServeHTTP(w, r)
				return
			}

			// Try to extract and validate the token
			authHeader := r.Header.Get("Authorization")
			if authHeader != "" {
				bearerPrefix := "Bearer "
				if strings.HasPrefix(authHeader, bearerPrefix) {
					tokenString := strings.TrimPrefix(authHeader, bearerPrefix)
					user, err := ValidateToken(tokenString, cfg.Auth.Secret, cfg.Auth.Users)
					if err == nil {
						// Token is valid, add user to context
						ctx := context.WithValue(r.Context(), userKey{}, user)
						ctx = context.WithValue(ctx, requestKey{}, r)
						next.ServeHTTP(w, r.WithContext(ctx))
						return
					}
					log.Warnf("Invalid token: %v", err)
				}
			}
			// If we reach here, either no token was provided or it was invalid
			// Continue without authentication
			ctx := context.WithValue(r.Context(), requestKey{}, r)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
