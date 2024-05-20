# Stage 1: Build the Vue.js app
FROM node:18.14.2-alpine AS build

# Set workdir
WORKDIR /app

# Copy dependencies reference file
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Vue.js application (production or staging build)
ARG BUILD_MODE=staging

# Build the Vue.js application
RUN npm run -p type-check build-only -- --mode $BUILD_MODE

# Stage 2: Serve the production build with Nginx
FROM nginx:stable

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY Docker-nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
