all: ui-deps ui go
all-in-one: ui-deps ui go-dist
aio: all-in-one

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

lint:
	golangci-lint run -v ./...
	cd ui && yarn lint

curio-rpc-gen:
	go run ./graph/curiorpc/gen
	goimports -w graph/curiorpc
.PHONY: api-gen

type-gen:
	 cd ui && yarn graphql-codegen -c ../codegen.yml

go-gen:
	go generate ./...

gen: go-gen curio-rpc-gen type-gen
