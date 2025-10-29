# Use Node.js LTS
FROM node:24-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY ../../src/websocket/package*.json ./

# Install dependencies
RUN npm install

# Copy all files from host to container
COPY ../../src/websocket .

# Expose WebSocket port
EXPOSE 8081

# Start WebSocket server
CMD ["node", "index.js"]