
# Curio Dashboard

[![Build Status](https://github.com/web3tea/curio-dashboard/workflows/CI/badge.svg)](https://github.com/web3tea/curio-dashboard/actions) [![Go Report Card](https://goreportcard.com/badge/github.com/web3tea/curio-dashboard)](https://goreportcard.com/report/github.com/web3tea/curio-dashboard) [![CodeFactor](https://www.codefactor.io/repository/github/web3tea/curio-dashboard/badge)](https://www.codefactor.io/repository/github/web3tea/curio-dashboard) [![GitHub release (latest by date)](https://img.shields.io/github/v/release/web3tea/curio-dashboard)](https://github.com/web3tea/curio-dashboard/releases)

## Overview

`Curio Dashboard` is a web-based interface designed for monitoring and managing your [Curio](https://github.com/filecoin-project/curio) cluster. It provides an intuitive layout with real-time metrics and rich visualizations, allowing you to efficiently oversee cluster activity and data insights.

| ![Overview](https://pub-9a61031c6282458db7b0b90fa2365e69.r2.dev/curio-dashboard/overview.png) | ![Machine](https://pub-9a61031c6282458db7b0b90fa2365e69.r2.dev/curio-dashboard/machines.png) |
|:--------------------------------:|:------------------------------:|
| ![Porep](https://pub-9a61031c6282458db7b0b90fa2365e69.r2.dev/curio-dashboard/porep.png) | ![IPNI](https://pub-9a61031c6282458db7b0b90fa2365e69.r2.dev/curio-dashboard/ipni.png) |
### Key Features

- **Authenticated Access**: Secure login ensures data protection.
- **Efficient Data Management**: Server-side pagination and filtering for handling large datasets.
- **Responsive UI**: Dark/light mode support and mobile-friendly for enhanced usability.
- **Real-Time Monitoring**: Live data streaming for real-time insights.
- **Data Visualizations**: Detailed charts to analyze cluster performance and trends.

## Architecture Diagram
```mermaid
flowchart TD
    %% UI / Frontend
    subgraph "UI / Frontend"
        UI["Curio Dashboard UI (Vue.js)"]:::frontend
    end

    %% Backend Service Layer
    subgraph "Backend Service"
        BA["Main Application (Go)"]:::backend
        CI["Configuration & Initialization"]:::backend
        GA["GraphQL API Layer (gqlgen)"]:::backend
        DB["Database Integration (Connector)"]:::backend
        IH["Internal Helpers"]:::backend
    end

    %% External Services Layer
    subgraph "External Services"
        CN["Curio Node API"]:::external
        YD["YugabyteDB"]:::external
        PM["Prometheus"]:::external
        EX["Curio Exporter"]:::external
        LD["Lotus Daemon"]:::external
    end

    %% CI/CD & Containerization Layer
    subgraph "CI/CD & Containerization"
        CCD["CI/CD & Containerization"]:::ci
    end

    %% Data Flow Connections
    UI -->|"GraphQL_call"| GA

    CI -->|"init_ready"| BA
    BA -->|"expose_API"| GA
    BA -->|"handles_db"| DB
    BA -->|"uses_helpers"| IH

    GA -->|"curio webrpc"| CN
    GA -->|"metrics"| PM
    DB -->|"query_db"| YD
    BA -->|"blockchain_data"| LD

    CN -->|"direct_metrics"| PM
    EX -->|"fetch_yb_data"| YD
    EX -->|"expose_metrics"| PM

    CCD -->|"deploys"| BA

     %% Click Events
        click BA "https://github.com/web3tea/curio-dashboard/blob/main/cmd/main.go"
        click CI "https://github.com/web3tea/curio-dashboard/blob/main/config/config.go"
        click GA "https://github.com/web3tea/curio-dashboard/tree/main/graph"
        click DB "https://github.com/web3tea/curio-dashboard/blob/main/db/harmony.go"
        click IH "https://github.com/web3tea/curio-dashboard/tree/main/types"
        click UI "https://github.com/web3tea/curio-dashboard/tree/main/ui"
        click CCD "https://github.com/web3tea/curio-dashboard/tree/main/Dockerfile"
        click EX "https://github.com/web3tea/curio-exporter"

    %% Styles
    classDef frontend fill:#F0F0F0,stroke:#333,stroke-width:2px,color:#000;
    classDef backend fill:#F0F0F0,stroke:#333,stroke-width:2px,color:#000;
    classDef external fill:#F0F0F0,stroke:#333,stroke-width:2px,color:#000;
    classDef ci fill:#F0F0F0,stroke:#333,stroke-width:2px,color:#000;
```

## Requirements

- **Curio Node**: A reachable Curio Web API, e.g., `http://localhost:4701`.
- **YugabyteDB**: Distributed database used by the Curio cluster.
- **Prometheus**: Collects metrics from the Curio cluster for monitoring. (Optional)
- **Lotus Daemon Node**: Required for blockchain data retrieval.

## Usage

### Docker

```bash
# Pull the latest Docker image
docker pull ghcr.io/web3tea/curio-dashboard:latest  # Use the latest release
# docker pull ghcr.io/web3tea/curio-dashboard:main # Use the main branch

# Generate the default configuration file
docker run --rm ghcr.io/web3tea/curio-dashboard:latest config default > config.toml

# Edit the configuration file
# vim config.toml # or use your preferred text editor

# Run the dashboard
docker run -d \
  -p 9091:9091 \
  --restart unless-stopped \
  -v "$(pwd)"/config.toml:/config.toml:ro \
  ghcr.io/web3tea/curio-dashboard:latest --debug run
```

### Pre-built Binaries

Visit the [Releases](https://github.com/web3tea/curio-dashboard/releases) page to download the latest binaries.

After downloading the correct binary for your platform and architecture, follow the [Running the Dashboard](#running-the-dashboard) instructions below.

### Building From Source

Follow these steps to build the dashboard from source:

1. **Install System Dependencies**
   Follow the [Curio Storage Installation Guide](https://docs.curiostorage.org/installation#linux-build-from-source).
   You’ll also need Node.js and Yarn for the frontend.

2. **Clone the Repository**
   ```bash
   git clone https://github.com/web3tea/curio-dashboard.git
   ```

3. **Build the Project**
   ```bash
   cd curio-dashboard
   make
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
   - Production URL: [http://localhost:9091](http://localhost:9091)
   - Development URL: [http://localhost:3000](http://localhost:3000) (`cd ui; yarn dev`)
