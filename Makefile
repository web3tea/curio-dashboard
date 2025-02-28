aio: all-in-one
all: ui-deps ui go
all-in-one: ui-deps ui go-dist

ldflags=-s -w -X github.com/strahe/curio-dashboard/version.CurrentCommit=$(shell git describe --tags --always --dirty 2>/dev/null || git rev-parse --short HEAD 2>/dev/null)
GOFLAGS+=-ldflags="$(ldflags)"

go:
	go build $(GOFLAGS) -o curio-dashboard ./cmd

go-dist:
	go build $(GOFLAGS) -o curio-dashboard -tags dist ./cmd

ui-deps:
	cd ui && yarn install

ui:
	cd ui && yarn build
.PHONY: ui

lint: golanglint uilint i18n-check

golanglint:
	golangci-lint run -v ./...

uilint:
	cd ui && yarn lint

i18n-check:
	cd ui && yarn i18n:check

i18n-extract:
	cd ui && yarn i18n:extract

curio-rpc-gen:
	go run ./graph/curiorpc/gen
	goimports -w graph/curiorpc
.PHONY: api-gen

type-gen:
	 cd ui && yarn type-gen

go-gen:
	go generate ./...

gen: go-gen curio-rpc-gen type-gen

clean:
	rm -f curio-dashboard
	cd ui && rm -rf dist node_modules
