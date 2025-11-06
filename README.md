# WebSocket Server Documentation

This project implements a WebSocket server for real-time communication, primarily handling order updates and customer notifications.

## 1. Package

The project uses `ws` as its WebSocket library. To install it, run:

```bash
npm install ws
```
## 2. How to Use

### Server (`index.js`)

The WebSocket server listens on `0.0.0.0:8081`. It manages connections from different `restaurant_id`s and `uuid`s (for customers).

**Message Types:**
- `kot`: Kitchen Order Ticket updates.
- `waiter`: Waiter-related notifications.
- `reservation`: Reservation updates.
- `login`: Customer login/registration.
- `update`: General updates for specific customers.

**Connection Handling:**
- When a client connects, it can register itself with a `restaurant_id` by sending a message with this ID.
- Customers can register with a `uuid` and `type: 'login'`.

**Message Flow:**
- Messages with `order_id` and `restaurant_id` are broadcast to all clients connected to that `restaurant_id`.
- Messages with `type: 'update'` and `uuid` are sent to the specific customer associated with that `uuid`.

### Client (`customer.js`)

This is an example client that connects to the WebSocket server. It demonstrates how to send an `update` message with a `uuid`.

```javascript
import WebSocket from 'ws';

const ws = new WebSocket('wss://uncornered-seamus-nonnaturally.ngrok-free.dev'); // Replace with your server address

ws.on('open', () => {
    console.log('✅ Connected');
    // Example: Send an update message after 2 seconds
    setTimeout(() => {
        let uuid = {
            uuid: '4652286c-859d-44c9-a8bb-5542a9f95d74',
            type: 'update'
        };
        ws.send(JSON.stringify(uuid));
    }, 2000);
});

ws.on('message', (msg) => {
    console.log('📨 Received:', msg.toString());
});

ws.on('close', (code, reason) => {
    console.warn('❌ Connection closed!');
});
```

## 3. Testing

The `test.js` file provides a basic client for testing the server's broadcast functionality. It connects to the WebSocket server and sends a `waiter` type message with a random `order_id` and a `restaurant_id`.

```javascript
import WebSocket from 'ws';

const ws = new WebSocket('wss://uncornered-seamus-nonnaturally.ngrok-free.dev'); // Replace with your server address

ws.on('open', () => {
    console.log('✅ Connected');
    const restaurantId = 13;

    setTimeout(() => {
        const order = {
            order_id: Math.floor(Math.random() * 1000),
            type : 'waiter',
            restaurant_id: restaurantId,
            count: 1,
            action: 'created'
        };
        ws.send(JSON.stringify(order));
    }, 2000);
});

ws.on('message', (msg) => {
    console.log('📨 Received:', msg.toString());
});

ws.on('close', (code, reason) => {
    console.warn('❌ Connection closed!');
});
```

## 4. Set up server with ngrok and Docker WebSocket

This project can be easily set up using Docker and exposed to the internet via ngrok.

### Prerequisites
- Docker and Docker Compose installed.
- An ngrok account and authtoken.

### Configuration

**`ngrok.yml`:**

```yaml
version: 2
log_level: debug
tunnels:
  websocket:
    proto: http
    addr: websocket-webpush-1:8081
    domain: uncornered-seamus-nonnaturally.ngrok-free.dev # Replace with your ngrok domain
```

**`Dockerfile`:**

```dockerfile
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
```

**`docker-compose.yml`:**

```yaml
services:
  webpush:
    build:
      context: .
      dockerfile: ./images/websocket/Dockerfile
    ports:
      - "8081:8081"
  ngrok:
    image: ngrok/ngrok:latest
    restart: unless-stopped
    volumes:
      - ./ngrok.yml:/etc/ngrok.yml
    command: start --all --config /etc/ngrok.yml
    environment:
      NGROK_AUTHTOKEN: 34m8Ua2qAmyxOdEHIpzhqdL6kTC_5DmEo53u5geUsULgiCfoT # Replace with your ngrok authtoken
```

### Steps to Run

1.  **Save your ngrok authtoken:** Ensure your `ngrok.yml` has the correct `NGROK_AUTHTOKEN`.
2.  **Build and run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```

This will start the WebSocket server and the ngrok tunnel, making your WebSocket server accessible via the ngrok domain.
