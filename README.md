
# Curio Dashboard

**Status: Under Heavy Development**

## Overview

`Curio Dashboard` is a web-based interface designed for monitoring and analyzing the performance of your [Curio](https://github.com/filecoin-project/curio) cluster. It offers an intuitive interface with real-time metrics and rich visualizations, helping you efficiently track cluster performance and data insights.

### Key Features

- **Authenticated Access**: Secure login ensures data protection.
- **Efficient Data Management**: Server-side pagination and filtering for handling large datasets.
- **Responsive UI**: Dark/light mode support and mobile-friendly for enhanced usability.
- **Real-Time Monitoring**: Live data streaming for real-time insights.
- **Data Visualizations**: Detailed charts to analyze cluster performance and trends.

## Requirements

- **Curio Node**: A reachable Curio Web API, e.g., `http://localhost:4701`.
- **YugabyteDB**: Distributed database used by the Curio cluster.
- **Prometheus**: Collects metrics from the Curio cluster for monitoring. (Optional)
- **Lotus Daemon Node**: Required for blockchain data retrieval.

## Usage

### Docker

```bash
# Pull the latest Docker image
docker pull ghcr.io/strahe/curio-dashboard:latest  # The Latest release Or use a specific version tag
# docker pull ghcr.io/strahe/curio-dashboard:main # Use the main branch for the latest changes 

# Generate the default configuration file
docker run --rm ghcr.io/strahe/curio-dashboard:latest config default > config.toml

# Customize the `config.toml` file according to your setup.

# Run the dashboard
docker run \
  -p 9091:9091 \
  -v "$(pwd)"/config.toml:/config.toml:ro \
  ghcr.io/strahe/curio-dashboard:latest --debug run
```

### Pre-built Binaries

Visit the [Releases](https://github.com/strahe/curio-dashboard/releases) page to download the latest binaries.

After downloading the correct binary for your platform and architecture, follow the [Running the Dashboard](#running-the-dashboard) instructions below.

### Building From Source

Follow these steps to build the dashboard from source:

1. **Install System Dependencies**  
   Follow the [Curio Storage Installation Guide](https://docs.curiostorage.org/installation#linux-build-from-source).
   You’ll also need Node.js and Yarn for the frontend.

2. **Clone the Repository**
   ```bash
   git clone https://github.com/strahe/curio-dashboard.git
   ```

3. **Build the Project**
   ```bash
   cd curio-dashboard
   make aio
   ```

## Running the Dashboard

1. **Generate Default Configuration**
   ```bash
   ./curio-dashboard config default > config.toml
   ```

2. **Edit the Configuration**
   Adjust the `config.toml` to match your setup, or start with a [minimal configuration file](minimal.config.toml).

3. **Start the Backend**
   ```bash
   ./curio-dashboard --debug run
   ```

4. **Access the Dashboard**
   - Production URL: [http://localhost:9091](http://localhost:9091) (available only with `make aio`)
   - Development URL: [http://localhost:3000](http://localhost:3000) (`cd ui; yarn dev`)
