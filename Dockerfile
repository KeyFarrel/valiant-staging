# Stage 1: Build the Vue.js app
FROM harbor.pln.co.id/library/node:18.17.0-alpine AS build

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
FROM harbor.pln.co.id/library/nginx:stable-alpine

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY Docker-nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]