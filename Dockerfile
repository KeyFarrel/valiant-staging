# Stage 0: Build the Go WebAssembly binary with security-hardened flags.
#
# -trimpath removes all local filesystem paths embedded by the Go compiler,
# which prevents CWE-248 (path disclosure through exception/debug data).
# -ldflags="-s -w" strips the symbol table and DWARF debug sections.
#
# This stage only runs when a wasm/go.mod is present (i.e. the Go source has
# been committed to the repository).  Until then the pre-built binary in
# public/wasm/main.wasm is used as-is.  See wasm/README.md for instructions
# on rebuilding the binary with these flags.
FROM harbor.pln.co.id/library/golang:1.24-alpine AS wasm-build
WORKDIR /wasm-src
# Copy the wasm source directory; if no *.go files exist the build is skipped.
COPY wasm/ ./
RUN mkdir -p /wasm-output && \
    if [ -f go.mod ]; then \
      GOOS=js GOARCH=wasm go build \
        -trimpath \
        -ldflags="-s -w" \
        -o /wasm-output/main.wasm \
        . ; \
    fi

# Stage 1: Build the Vue.js app
FROM harbor.pln.co.id/library/node:20-alpine AS build

WORKDIR /app

# Copy dependencies reference file
COPY package.json package-lock.json ./

# Install dependencies securely
RUN npm ci \
  && npm audit --production --audit-level=high

# Copy the rest of the application
COPY . .

# Build the Vue.js application
ARG BUILD_SCRIPT=build:development
RUN npm run $BUILD_SCRIPT

# Stage 2: Serve the staging build with Nginx
FROM harbor.pln.co.id/library/nginx:stable-alpine

# Update Alpine packages to fix CVE vulnerabilities
RUN apk update && apk upgrade --no-cache && \
  apk add --no-cache \
  libxml2>=2.12.7-r3 \
  libexpat>=2.7.2-r0 \
  libcrypto3>=3.3.5-r0 \
  libssl3>=3.3.5-r0 \
  libxslt>=1.1.39-r2 \
  xz-libs>=5.6.2-r1 \
  curl>=8.14.1-r2 \
  libcurl>=8.14.1-r2 \
  musl>=1.2.5-r1 \
  musl-utils>=1.2.5-r1

# Create a non-root user and group for running Nginx
RUN addgroup -g 1001 -S appgroup && \
  adduser -u 1001 -S appuser -G appgroup

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Overlay the WASM binary built with -trimpath if the Go source was present.
# When the wasm-build stage produced a binary (i.e. wasm/go.mod exists and the
# Go source is committed), it replaces the pre-built binary from the dist copy
# above, ensuring no local filesystem paths are embedded (CWE-248 fix).
COPY --from=wasm-build /wasm-output/ /usr/share/nginx/html/wasm/

# Copy the custom Nginx configuration file
COPY Docker-nginx.conf /etc/nginx/conf.d/default.conf

# Set proper permissions for Nginx directories
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
  chown -R appuser:appgroup /var/cache/nginx && \
  chown -R appuser:appgroup /var/log/nginx && \
  chown -R appuser:appgroup /etc/nginx/conf.d && \
  touch /var/run/nginx.pid && \
  chown -R appuser:appgroup /var/run/nginx.pid

# Switch to non-root user
USER appuser

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]