package graph

import (
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"github.com/web3tea/curio-dashboard/config"
)

type authHandler struct {
	cfg *config.Config
}

type authData struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

var authFailed = echo.NewHTTPError(http.StatusUnauthorized, "invalid username or password")

func (h *authHandler) Login(c echo.Context) error {
	user := new(authData)
	if err := c.Bind(user); err != nil {
		return authFailed
	}

	for _, u := range h.cfg.Auth.Users {
		if u.Username == user.Username && u.Password == user.Password {
			claims := jwt.MapClaims{}
			claims["username"] = user.Username
			claims["description"] = u.Description
			if h.cfg.Auth.Expires > 0 {
				claims["exp"] = time.Now().Add(time.Hour * time.Duration(h.cfg.Auth.Expires)).Unix()
			}
			token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

			ts, err := token.SignedString([]byte(h.cfg.Auth.Secret))
			if err != nil {
				return err
			}

			return c.JSON(http.StatusOK, map[string]string{
				"token":       ts,
				"username":    user.Username,
				"description": u.Description,
			})
		}
	}
	return authFailed
}
