package db

import (
	"context"
	"strings"
	"time"

	"github.com/strahe/curio-dashboard/config"

	"github.com/georgysavva/scany/v2/dbscan"
	logging "github.com/ipfs/go-log/v2"
	"github.com/samber/lo"
	"github.com/yugabyte/pgx/v5"
	"github.com/yugabyte/pgx/v5/pgconn"
	"github.com/yugabyte/pgx/v5/pgxpool"
)

var log = logging.Logger("db")

type HarmonyDB struct {
	cfg *pgxpool.Config
	pgx *pgxpool.Pool
}

// NewHarmonyDB creates a new HarmonyDB instance.
// The url parameter should be a postgres connection string.
// "postgres://username:password@localhost:5433/database_name?search_path=curio"
func NewHarmonyDB(ctx context.Context, hCfg config.HarmonyDBConfig) (*HarmonyDB, error) {
	cfg, err := pgxpool.ParseConfig(hCfg.URL)
	if err != nil {
		return nil, err
	}
	cfg.ConnConfig.RuntimeParams["application_name"] = "curio-dashboard"
	cfg.ConnConfig.OnNotice = func(_ *pgconn.PgConn, n *pgconn.Notice) {
		log.Debug("database notice: " + n.Message + ": " + n.Detail)
	}

	// We want to ensure that we are connecting to a read-only replica.
	// You can manually set this in the connection string to avoid this.
	// For more information, see https://www.postgresql.org/docs/16/libpq-connect.html#LIBPQ-CONNECT-TARGET-SESSION-ATTRS
	if !strings.Contains(hCfg.URL, "target_session_attrs") {
		cfg.ConnConfig.ValidateConnect = pgconn.ValidateConnectTargetSessionAttrsReadOnly
	}
	ctx, cancel := context.WithTimeout(ctx, time.Second*5)
	defer cancel()

	pool, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		return nil, err
	}
	return &HarmonyDB{cfg: cfg, pgx: pool}, pool.Ping(ctx)
}

func (db *HarmonyDB) Close() {
	db.pgx.Close()
}

type Row interface {
	Scan(...any) error
}

type dbscanRows struct {
	pgx.Rows
}

func (d dbscanRows) Close() error {
	d.Rows.Close()
	return nil
}
func (d dbscanRows) Columns() ([]string, error) {
	return lo.Map(d.Rows.FieldDescriptions(), func(fd pgconn.FieldDescription, _ int) string {
		return fd.Name
	}), nil
}

func (d dbscanRows) NextResultSet() bool {
	return false
}

func (db *HarmonyDB) QueryRow(ctx context.Context, sql string, arguments ...any) Row {
	return db.pgx.QueryRow(ctx, sql, arguments...)
}

func (db *HarmonyDB) Select(ctx context.Context, sliceOfStructPtr any, sql string, arguments ...any) error {
	rows, err := db.pgx.Query(ctx, sql, arguments...)
	if err != nil {
		return err
	}
	defer rows.Close()
	if rows.Err() != nil {
		return rows.Err()
	}
	return dbscan.ScanAll(sliceOfStructPtr, dbscanRows{rows})
}

func (db *HarmonyDB) Exec(ctx context.Context, sql string, arguments ...any) (count int, err error) {
	res, err := db.pgx.Exec(ctx, sql, arguments...)
	return int(res.RowsAffected()), err
}
