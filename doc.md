# Project Documentation: WebSocket Server

## Overview
This project is a WebSocket server built with Node.js and the `ws` library. It facilitates real-time communication between restaurant systems and customers, supporting various message types such as Kitchen Order Tickets (KOT), waiter notifications, reservations, and customer updates.

## Key Features
- **Restaurant Registration**: Clients can register to receive updates for specific `restaurant_id`s.
- **Customer Registration**: Customers can register using a unique `uuid` for targeted updates.
- **Broadcast Messaging**: Supports broadcasting messages to all clients within a specific restaurant.
- **Targeted Messaging**: Sends specific updates to individual customers based on their `uuid`.

## Message Types
- `kot`: Kitchen Order Ticket updates.
- `waiter`: Waiter-related notifications.
- `reservation`: Reservation updates.
- `login`: Customer login and registration.
- `update`: General status updates for specific customers.

## Setup and Running
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Server**:
   ```bash
   node index.js
   ```
3. **Run Tests**:
   ```bash
   npm test
   ```

## Docker and Deployment
The project includes a `Dockerfile` and `docker-compose.yml` for containerized deployment, integrated with `ngrok` for exposing the local server via a secure tunnel.
