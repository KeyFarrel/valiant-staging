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

# Copy the custom Nginx configuration file
COPY Docker-nginx.conf /etc/nginx/conf.d/default.conf

# Create SSL directory for certificate mounting (certs provided at runtime via volume or secret)
RUN mkdir -p /etc/nginx/ssl && \
  chown -R appuser:appgroup /etc/nginx/ssl && \
  chmod 750 /etc/nginx/ssl

# Set proper permissions for Nginx directories
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
  chown -R appuser:appgroup /var/cache/nginx && \
  chown -R appuser:appgroup /var/log/nginx && \
  chown -R appuser:appgroup /etc/nginx/conf.d && \
  touch /var/run/nginx.pid && \
  chown -R appuser:appgroup /var/run/nginx.pid

# Switch to non-root user
USER appuser

# Expose HTTP and HTTPS ports
EXPOSE 80 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]