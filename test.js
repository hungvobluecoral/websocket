import WebSocket from 'ws';

const ws = new WebSocket('ws://103.177.110.109:8081');

ws.on('open', () => {
    console.log('✅ Connected');

    const restaurantId = 15;

    setTimeout(() => {
        const order = {
            order_id: Math.floor(Math.random() * 1000),
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
