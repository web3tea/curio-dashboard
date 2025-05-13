package config

import (
	"github.com/BurntSushi/toml"
	"github.com/samber/lo"
)

type HarmonyDBConfig struct {
	URL string `toml:"url" comment:"URL to connect to the HarmonyDB database, should be a postgres connection string"`
}

type ChainConfig struct {
	APIs []string `toml:"apis" comment:"List of chain API to connect to"`
}

type CurioConfig struct {
	APIs []string `toml:"apis" comment:"List of Curio API to connect to"`
}

type MetricsConfig struct {
	Enabled    bool   `toml:"enabled" comment:"Enable metrics api for analytics, must provide the Prometheus URL for collecting Curio metrics."`
	Prometheus string `toml:"prometheus" comment:"URL to connect to the Prometheus server"`
}

// UserConfig represents a user for the dashboard
// Currently, the simplest way to store user information is used,
// and in the future, consider using a database to store user information
type UserConfig struct {
	Username    string `toml:"username" comment:"Username for the user"`
	Password    string `toml:"password" comment:"Password for the user, default to a random string"`
	Role        string `toml:"role" comment:"Role for the user, allow 'admin', 'operator', 'user'. default to 'user'"`
	Description string `toml:"description" comment:"Description for the user"`
}

type HTTPConfig struct {
	Listen string `toml:"listen" comment:"Address to listen on for the API server"`
}

type AuthConfig struct {
	Secret  string       `toml:"secret" comment:"Secret key for JWT token, default to a random string, keep it confidential"`
	Expires int          `toml:"expires" comment:"Token expiration time in hours, default to 24 hours"`
	Users   []UserConfig `toml:"users" comment:"List of users allow to access the dashboard"`
}

type FeaturesConfig struct {
	Metrics MetricsConfig `toml:"metrics" comment:"Metrics configuration"`
}

type Config struct {
	HTTP      HTTPConfig      `toml:"api" comment:"Http configuration"`
	HarmonyDB HarmonyDBConfig `toml:"harmonydb" comment:"HarmonyDB database configuration"`
	Chain     ChainConfig     `toml:"chain" comment:"Chain API configuration"`
	Curio     CurioConfig     `toml:"curio" comment:"Curio configuration"`
	Auth      AuthConfig      `toml:"auth" comment:"Authentication configuration"`
	Features  FeaturesConfig  `toml:"features" comment:"Features configuration"`
}

func NewFromFile(filePath string) (*Config, error) {
	cfg := DefaultConfig
	if _, err := toml.DecodeFile(filePath, &cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}

var DefaultConfig = Config{
	HTTP: HTTPConfig{
		Listen: ":9091",
	},
	HarmonyDB: HarmonyDBConfig{
		URL: "postgres://yugabyte:yugabyte@127.0.0.1:5433/curio?search_path=curio",
	},
	Chain: ChainConfig{
		APIs: []string{
			"token:/ip4/127.0.0.1/tcp/1234/http",
		},
	},
	Auth: AuthConfig{
		Secret:  lo.RandomString(32, lo.LettersCharset),
		Expires: 24 * 30,
		Users: []UserConfig{
			{Username: "admin", Password: lo.RandomString(24, lo.LettersCharset), Description: "Administrator"},
		},
	},
	Features: FeaturesConfig{
		Metrics: MetricsConfig{
			Enabled:    true,
			Prometheus: "http://localhost:9090",
		},
	},
	Curio: CurioConfig{
		APIs: []string{
			"http://127.0.0.1:4701",
		},
	},
}
