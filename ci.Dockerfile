# Only used for the ci
FROM ubuntu:jammy as builder

# Update and install necessary packages
RUN apt update && apt install -y libhwloc-dev

# Use the buildpack-deps image for the final image
FROM ubuntu:jammy

COPY curio-dashboard /usr/bin/curio-dashboard
# Copy necessary files from the builder
COPY --from=builder /usr/lib/x86_64-linux-gnu/libOpenCL.so* /lib/
COPY --from=builder /usr/lib/x86_64-linux-gnu/libhwloc.so* /lib/
COPY --from=builder /usr/lib/x86_64-linux-gnu/libnuma.so* /lib/
COPY --from=builder /usr/lib/x86_64-linux-gnu/libltdl.so* /lib/

ENTRYPOINT ["/usr/bin/curio-dashboard"]
CMD ["--help"]