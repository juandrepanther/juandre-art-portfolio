# Use the official Node.js v16 image as the base
FROM node:18 AS builder

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install --frozen-lockfile --non-interactive

# Copy the rest of the app to the container
COPY . .

# Build the app using Vite.js
RUN yarn build

# Use the official Nginx v1.21 image as the base
FROM nginx:latest

# Copy the built app to the Nginx server's public directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx configuration file to the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]