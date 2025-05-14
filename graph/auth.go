package graph

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/web3tea/curio-dashboard/config"
	"github.com/web3tea/curio-dashboard/graph/model"
)

type (
	userKey     struct{}
	UserContext struct {
		Username string
		Role     model.Role
	}
)

type authHandler struct {
	cfg *config.Config
}

type authData struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (h *authHandler) Login(w http.ResponseWriter, r *http.Request) {
	var user authData
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		writeError(w, "failed to decode request body", http.StatusBadRequest)
		return
	}
	for _, u := range h.cfg.Auth.Users {
		if u.Username == user.Username && u.Password == user.Password {
			ts, err := GenerateToken(h.cfg.Auth.Secret, time.Duration(h.cfg.Auth.Expires)*time.Hour, user.Username, model.Role(u.Role))
			if err != nil {
				writeError(w, "failed to generate token", http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]string{ // nolint: errcheck
				"token":       ts,
				"username":    user.Username,
				"description": u.Description,
			})
			return
		}
	}
	writeError(w, "invalid username or password", http.StatusUnauthorized)
}

func GenerateToken(secret string, expires time.Duration, username string, role model.Role) (string, error) {
	claims := jwt.MapClaims{}
	claims["username"] = username
	claims["role"] = role
	if expires > 0 {
		claims["exp"] = time.Now().Add(expires).Unix()
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	ts, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}
	return ts, nil
}

func ValidateToken(tokenString string, secret string, users []config.UserConfig) (*UserContext, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if exp, ok := claims["exp"].(int64); ok && time.Unix(exp, 0).Before(time.Now()) {
			return nil, fmt.Errorf("token expired")
		}
		username := claims["username"].(string)
		role := model.Role(claims["role"].(string))
		user, err := FindUser(users, username)
		if err != nil {
			return nil, err
		}
		if user.Role != role {
			return nil, fmt.Errorf("user role mismatch")
		}
		// Return successful validation result
		return user, nil
	}
	return nil, fmt.Errorf("invalid token")
}

func writeError(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{ // nolint: errcheck
		"message": msg,
	})
}
