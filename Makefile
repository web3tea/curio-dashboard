aio: all-in-one
all: ui-deps ui go
all-in-one: ui-deps ui go-dist

ldflags=-s -w -X github.com/strahe/curio-dashboard/version.CurrentCommit=$(shell git describe --tags --always --dirty 2>/dev/null || git rev-parse --short HEAD 2>/dev/null)
GOFLAGS+=-ldflags="$(ldflags)"

# Curio Development Environment Setup
CURIO_REPO?=https://github.com/filecoin-project/curio.git
CURIO_DIR=./curio-devnet
CURIO_VERSION?=v1.25.0

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

curio-setup:
	@echo "Setting up Curio development environment..."
	@if [ ! -d "$(CURIO_DIR)" ]; then \
		echo "Cloning Curio repository (version: $(CURIO_VERSION))..."; \
		git clone --depth 1 --branch $(CURIO_VERSION) $(CURIO_REPO) $(CURIO_DIR); \
	else \
		echo "Curio repository already exists, updating..."; \
		cd $(CURIO_DIR) && git pull; \
	fi
	@echo "Curio repository setup complete."

curio-devnet: curio-setup
	@echo "Preparing Curio development environment..."
	cd $(CURIO_DIR) && make docker/devnet
	@echo "Curio development environment prepared."

curio-start: curio-setup
	@echo "Preparing directories for Curio development environment..."
	@mkdir -p $(CURIO_DIR)/docker/data
	@chmod -R 777 $(CURIO_DIR)/docker/data
	@echo "Starting Curio development environment..."
	cd $(CURIO_DIR) && make devnet/up
	@echo "Curio development environment started."

curio-stop:
	@echo "Checking if Curio environment is running..."
	@if [ -d "$(CURIO_DIR)" ] && [ -f "$(CURIO_DIR)/docker/docker-compose.yaml" ]; then \
		echo "Stopping Curio development environment..."; \
		cd $(CURIO_DIR) && make devnet/down; \
		echo "Curio development environment stopped."; \
	else \
		echo "Curio environment not found, nothing to stop."; \
	fi

curio-clean: curio-stop
	@if [ -d "$(CURIO_DIR)" ]; then \
		echo "Removing Curio directory..."; \
		rm -rf $(CURIO_DIR); \
		echo "Curio directory removed."; \
	else \
		echo "Curio directory not found, nothing to remove."; \
	fi

curio-env: curio-setup curio-devnet curio-start
	@echo "Curio development environment setup complete and running."

.PHONY: curio-setup curio-devnet curio-start curio-stop curio-clean curio-env

clean: curio-clean
	rm -f curio-dashboard
	cd ui && rm -rf dist node_modules
