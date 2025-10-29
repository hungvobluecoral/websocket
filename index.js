import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ host: '0.0.0.0', port: 8081 });

const clients = {};

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

            // Nếu client gửi order / message
            if (data.order_id && data.restaurant_id) {
                // broadcast tới tất cả client cùng restaurant_id
                const sockets = clients[data.restaurant_id] || [];
                sockets.forEach((s) => s.send(JSON.stringify(data)));
                console.log(`Broadcasted order ${data.order_id} to ${sockets.length} client(s)`);
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
        console.log('Client disconnected');
    });
});