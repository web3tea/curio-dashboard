package graph

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/web3tea/curio-dashboard/config"
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
			claims := jwt.MapClaims{}
			claims["username"] = user.Username
			claims["description"] = u.Description
			if h.cfg.Auth.Expires > 0 {
				claims["exp"] = time.Now().Add(time.Hour * time.Duration(h.cfg.Auth.Expires)).Unix()
			}
			token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

			ts, err := token.SignedString([]byte(h.cfg.Auth.Secret))
			if err != nil {
				writeError(w, "failed to sign token", http.StatusInternalServerError)
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

func writeError(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{ // nolint: errcheck
		"message": msg,
	})
}
