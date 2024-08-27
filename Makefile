all: go-deps ui-deps ui go
all-in-one: go-deps ui-deps ui go-dist
aio: all-in-one

gen:
	go generate ./...
	 cd ui && yarn graphql-codegen -c ../codegen.yml

go-deps:
	git submodule update --init --recursive
	make -C extern/filecoin-ffi

go:
	go build -o curio-dashboard ./cmd

go-dist: ui
	go build -o curio-dashboard -tags dist ./cmd

ui-deps:
	cd ui && yarn install

ui:
	cd ui && yarn build
.PHONY: ui

lint:
	golangci-lint run -v ./...
	cd ui && yarn lint