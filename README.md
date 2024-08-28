# curio-dashboard

Status: **under heavy development**

## Description
`curio-dashboard` is a dashboard for [curio](https://github.com/filecoin-project/curio), it provides a web interface to monitor the status of curio.

Key features:
- Authenticated access
- Server side pagination and filtering (for large datasets)
- Responsive ui (dark/light mode, mobile friendly)
- Real-time updates

## Development

### Prerequisites
```shell
# Install system dependencies, refer to: https://lotus.filecoin.io/lotus/install/linux/#building-from-source

git clone https://github.com/strahe/curio-dashboard.git

cd curio-dashboard

make all

# or make all in one
# make aio
```

### Run 
```shell
# generate default config
./curio-dashboard config default > config.toml

# Edit config.toml to match your setup

# Run Backend
./curio-dashboard --debug run

# Run Frontend
cd ui && yarn dev

# Open http://localhost:3000
# http://localhost:9091 # for production, only available when make aio
# http://127.0.0.1:9091/playground # for graphql playground
```
