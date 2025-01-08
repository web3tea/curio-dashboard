ARG GO_BUILD_IMAGE=golang:1.23
ARG NODE_BUILD_IMAGE=node:22

FROM ${NODE_BUILD_IMAGE} AS node-builder

WORKDIR /tmp/build

COPY . .

RUN make ui-deps ui

# Use the Go build image as the builder
FROM ${GO_BUILD_IMAGE} AS go-builder

# Update and install necessary packages
RUN apt-get update && apt-get install -y hwloc ocl-icd-opencl-dev libhwloc-dev pkg-config

# Set the working directory and copy the project files
WORKDIR /tmp/build

COPY . .
COPY --from=node-builder /tmp/build/ui/dist /tmp/build/ui/dist

# Build the application
RUN make go-deps
RUN make go-dist

# Use the buildpack-deps image for the final image
FROM buildpack-deps:bookworm-curl

# Copy necessary files from the builder
COPY --from=go-builder /tmp/build/curio-dashboard /usr/bin/
COPY --from=go-builder /usr/lib/x86_64-linux-gnu/libOpenCL.so* /lib/
COPY --from=go-builder /usr/lib/x86_64-linux-gnu/libhwloc.so* /lib/
COPY --from=go-builder /usr/lib/x86_64-linux-gnu/libnuma.so* /lib/
COPY --from=go-builder /usr/lib/x86_64-linux-gnu/libltdl.so* /lib/

ENTRYPOINT ["/usr/bin/curio-dashboard"]
CMD ["--help"]
