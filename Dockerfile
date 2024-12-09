# Stage 1: Build the Vue.js app
FROM node:18.14.2-alpine AS build

WORKDIR /app

# Copy dependencies reference file
COPY package.json package-lock.json ./

# Install dependencies securely
RUN npm ci \
  && npm audit --production --audit-level=high

# Copy the rest of the application
COPY . .

# Build the Vue.js application
ARG BUILD_MODE=staging
RUN npx vite build --mode $BUILD_MODE

# Stage 2: Serve the staging build with Nginx
FROM nginx:stable-alpine

# Tambahkan user non-root
RUN addgroup -g 101 nginxgroup \
  && adduser -u 101 -G nginxgroup -D nginxuser \
  && chown -R nginxuser:nginxgroup /var/cache/nginx /var/run /var/log/nginx

# Update dan hardening paket
RUN apk add --no-cache tini \
  && apk upgrade --no-cache \
  && rm -rf /var/cache/apk/* /tmp/*

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY Docker-nginx.conf /etc/nginx/conf.d/default.conf

# Nonaktifkan izin yang tidak perlu
RUN chmod -R 755 /usr/share/nginx/html \
  && chmod -R 700 /etc/nginx \
  && chmod -R 700 /var/log/nginx

# Ganti ke user non-root
USER nginxuser

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]