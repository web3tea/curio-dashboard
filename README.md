# Curio Dashboard

**Status: Under Heavy Development**

## Overview

`Curio Dashboard` is a web-based monitoring tool for [Curio](https://github.com/filecoin-project/curio). It provides an intuitive interface for tracking the status and performance of your Curio cluster.

### Key Features

- **Authenticated Access**: Secure login to protect your data.
- **Server-Side Pagination & Filtering**: Efficient handling of large datasets.
- **Responsive UI**: Dark/light mode and mobile-friendly design.
- **Real-Time Updates**: Live data streaming for up-to-the-minute insights.
- **Insightful Charts**: Beautifully crafted visualizations to help you understand your metrics.

## Building the Dashboard

To build the dashboard, follow these steps:

1. **Install System Dependencies**  
   Refer to the [Curio Storage Installation Guide](https://docs.curiostorage.org/installation#linux-build-from-source).

2. **Clone the Repository**
   ```bash
   git clone https://github.com/strahe/curio-dashboard.git
   ```

3. **Build the Project**
   ```bash
   cd curio-dashboard
   make all
   # Alternatively, you can run:
   # make aio
   ```

## Requirements

- **YugabyteDB**: The database used by the Curio cluster.
- **Prometheus**: To collect metrics from the Curio cluster.
- **Lotus Daemon Node**: Required for blockchain data.

## Running the Dashboard

1. **Generate the Default Configuration**
   ```bash
   ./curio-dashboard config default > config.toml
   ```

2. **Edit the Configuration**
   Customize the `config.toml` file to suit your environment.

3. **Start the Backend**
   ```bash
   ./curio-dashboard --debug run
   ```

4. **Start the Frontend**
   ```bash
   cd ui && yarn dev
   ```

5. **Access the Dashboard**
    - Development: [http://localhost:3000](http://localhost:3000)
    - Production: [http://localhost:9091](http://localhost:9091) (available only with `make aio`)
    - GraphQL Playground: [http://127.0.0.1:9091/playground](http://127.0.0.1:9091/playground)
