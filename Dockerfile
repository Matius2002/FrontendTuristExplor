# Use Node.js as the base image
#FROM node:20.12.2-alpine as builder
FROM node:20.12.2 as builder
LABEL authors="MatteoRh"

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Angular CLI Globally
RUN npm install -g @angular/cli

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular project
#RUN npm run build

# Build the Angular app for production
RUN ng build

# Use nginx as the base image for serving the Angular application
FROM nginx:alpine

# Copy the built Angular app from the previous stage into the nginx server directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Set working directory to the copied directory (Option 1)
WORKDIR /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Command to run the nginx server
CMD ["nginx", "-g", "daemon off;"]


