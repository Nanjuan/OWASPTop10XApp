# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Install Docker client and other necessary tools
RUN apk add --no-cache \
    docker-cli \
    docker-compose \
    curl \
    bash \
    && rm -rf /var/cache/apk/*

# Switch to root to set up Docker permissions and install global packages
USER root

# Create docker group and add existing node user to it
RUN addgroup docker && \
    addgroup node docker

# Install nodemon globally as root
RUN npm install -g nodemon

# Switch back to node user
USER node

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY OT10XApp/package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY OT10XApp/ .

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the application with nodemon (hot-reload)
CMD ["npm", "run", "dev"]
