# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY OT10XApp/package*.json ./
RUN npm install

# Install nodemon globally so that it's available for hot reloading
RUN npm install -g nodemon

# Copy the rest of the application source code
COPY OT10XApp/ .

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the application with nodemon (hot-reload)
CMD ["npm", "run", "dev"]
