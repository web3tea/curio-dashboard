package main

import (
	"fmt"
	"time"

	"github.com/urfave/cli/v2"
	"github.com/web3tea/curio-dashboard/config"
	"github.com/web3tea/curio-dashboard/graph"
)

var authCmd = &cli.Command{
	Name:  "auth",
	Usage: "Authentication commands",
	Subcommands: []*cli.Command{
		generateToken,
		validateToken,
	},
}

var generateToken = &cli.Command{
	Name:    "generate-token",
	Aliases: []string{"gt"},
	Usage:   "Generate a JWT token for the given user",
	Flags: []cli.Flag{
		&cli.StringFlag{
			Name:     "user",
			Usage:    "Username to generate token for, must be a valid user",
			Required: true,
		},
		&cli.DurationFlag{
			Name:  "expires",
			Usage: "Token expiration time, default to 24 hours",
			Value: 24 * time.Hour,
		},
	},
	Action: func(c *cli.Context) error {
		cfg, err := config.NewFromFile(c.String("config"))
		if err != nil {
			return fmt.Errorf("failed to load config: %w", err)
		}
		user, err := graph.FindUser(cfg.Auth.Users, c.String("user"))
		if err != nil {
			return fmt.Errorf("failed to find user: %w", err)
		}
		token, err := graph.GenerateToken(cfg.Auth.Secret, c.Duration("expires"), user.Username, user.Role)
		if err != nil {
			return fmt.Errorf("failed to generate token: %w", err)
		}
		fmt.Printf("Token: %s\n", token)
		fmt.Printf("Expires: %s\n", time.Now().Add(c.Duration("expires")).Format(time.RFC3339))
		fmt.Printf("Username: %s\n", user.Username)
		fmt.Printf("Role: %s\n", user.Role)
		return nil
	},
}

var validateToken = &cli.Command{
	Name:    "validate-token",
	Aliases: []string{"vt"},
	Usage:   "Validate a JWT token",
	Flags: []cli.Flag{
		&cli.StringFlag{
			Name:     "token",
			Usage:    "JWT token to validate",
			Required: true,
		},
	},
	Action: func(c *cli.Context) error {
		cfg, err := config.NewFromFile(c.String("config"))
		if err != nil {
			return fmt.Errorf("failed to load config: %w", err)
		}
		token, err := graph.ValidateToken(cfg.Auth.Secret, c.String("token"), cfg.Auth.Users)
		if err != nil {
			return fmt.Errorf("failed to validate token: %w", err)
		}
		fmt.Printf("Token: %s\n", token)
		fmt.Printf("Username: %s\n", token.Username)
		fmt.Printf("Role: %s\n", token.Role)
		return nil
	},
}
