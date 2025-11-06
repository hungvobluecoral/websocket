import { WebSocketServer } from 'ws';

import { TYPE_KOT, TYPE_WAITER, TYPE_RESERVATION, TYPE_LOGIN, TYPE_UPDATE } from './const/index.js';

const wss = new WebSocketServer({ host: '0.0.0.0', port: 8081 });

const clients = {};
const customer = {};

wss.on('connection', (ws) => {

    ws.on('message', (msg) => {
        try {
            const data = JSON.parse(msg);

            // if (!data.restaurant_id) {
            //     console.log('❌ Client not registered. Closing connection.');
            //     ws.close();
            //     return;
            // }

            if (data.restaurant_id) {
                clients[data.restaurant_id] = clients[data.restaurant_id] || [];
                if (!clients[data.restaurant_id].includes(ws)) {
                    clients[data.restaurant_id].push(ws);
                }
                console.log(`number connect`, clients[data.restaurant_id].length);
                console.log(`Client registered for restaurant_id=${data.restaurant_id}`);  
            }

            if (data.uuid && data.type === TYPE_LOGIN) {
                customer[data.uuid] = ws;
                console.log(`Customer registered with uuid=${data.uuid}`);
            }

            // Nếu client gửi order / message
            if (data.order_id && data.restaurant_id) {
                // broadcast tới tất cả client cùng restaurant_id
                const sockets = clients[data.restaurant_id] || [];
                sockets.forEach((s) => s.send(JSON.stringify(data)));
                console.log(`Broadcasted order ${data.order_id} to ${sockets.length} client(s)`);
            }

            // type waiter
            if (data.type === TYPE_WAITER) {
                const sockets = clients[data.restaurant_id] || [];
                sockets.forEach((s) => s.send(JSON.stringify(data)));
                console.log(`Broadcasted waiter to ${sockets.length} client(s)`);
            }

            // type reservation
            if (data.type === TYPE_RESERVATION) {
                const sockets = clients[data.restaurant_id] || [];
                sockets.forEach((s) => s.send(JSON.stringify(data)));
                console.log(`Broadcasted reservation to ${sockets.length} client(s)`);
            }

            // type KOT
            if (data.type === TYPE_KOT) {
                const sockets = clients[data.restaurant_id] || [];
                sockets.forEach((s) => s.send(JSON.stringify(data)));
                console.log(`Broadcasted kot to ${sockets.length} client(s)`);
            }

            // Handle 'update' type with uuid
            if (data.type === TYPE_UPDATE && data.uuid) {
                const targetClient = customer[data.uuid];
                if (targetClient) {
                    targetClient.send(JSON.stringify(data));
                    console.log(`Sent update message to customer with uuid=${data.uuid}`);
                } else {
                    console.log(`Customer with uuid=${data.uuid} not found for update.`);
                }
            }
            
        } catch (err) {
            console.error('Invalid message', err);
        }
    });

    ws.on('close', () => {
        for (const restId in clients) {
            console.log(`clients[${restId}]:`, clients[restId].length);

            clients[restId] = clients[restId].filter(s => s !== ws);
            console.log(`clients[${restId}]:`, clients[restId].length);
        }
        for (const uuid in customer) {
            if (customer[uuid] === ws) {
                delete customer[uuid];
                console.log(`Customer with uuid=${uuid} disconnected`);
                break;
            }
        }
        console.log('Client disconnected');
    });
});
