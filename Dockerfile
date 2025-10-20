# Stage 1: Build the Vue.js app
# Using latest available Node 22 Alpine image from Harbor
FROM harbor.pln.co.id/library/node:22-alpine AS build

WORKDIR /app

# # Update and upgrade all packages to latest versions to patch CVEs
# RUN apk update && \
#   apk upgrade --no-cache && \
#   apk add --no-cache --upgrade \
#   libexpat \
#   libcrypto3 \
#   libssl3 \
#   libxml2 \
#   libxslt \
#   xz-libs \
#   libcurl \
#   curl \
#   musl \
#   musl-utils && \
#   rm -rf /var/cache/apk/*

# Copy dependencies reference file
COPY package.json package-lock.json ./

# Install dependencies securely
RUN npm ci \
  && npm audit --production --audit-level=high

# Copy the rest of the application
COPY . .

# Build the Vue.js application
ARG BUILD_MODE=development
RUN npx vite build --mode $BUILD_MODE

# Stage 2: Serve the staging build with Nginx
# Using latest available Nginx Alpine image from Harbor
FROM harbor.pln.co.id/library/nginx:stable-alpine

# # Update and upgrade all packages to latest versions to patch CVEs
# RUN apk update && \
#   apk upgrade --no-cache && \
#   apk add --no-cache --upgrade \
#   libexpat \
#   libcrypto3 \
#   libssl3 \
#   libxml2 \
#   libxslt \
#   xz-libs \
#   libcurl \
#   curl \
#   musl \
#   musl-utils && \
#   rm -rf /var/cache/apk/*

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY Docker-nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]