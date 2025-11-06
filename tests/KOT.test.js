import WebSocket from 'ws';

const WS_PORT = 8081;
const WS_URL = `ws://localhost:${WS_PORT}`;
const RESTAURANT_ID = 'restaurant123';

describe('KOT WebSocket Message', () => {
  let client;

  beforeEach((done) => {
    client = new WebSocket(WS_URL);

    client.onopen = () => {
      client.send(JSON.stringify({ type: 'login', restaurant_id: RESTAURANT_ID }));
      done();
    };

    client.onerror = (err) => {
      done(err);
    };
  });

  afterEach((done) => {
    if (client && client.readyState === WebSocket.OPEN) {
      client.close();
    }
    done();
  });

  test(
    'should broadcast KOT message to all clients in the same restaurant',
    (done) => {
      const kotMessage = {
        restaurant_id: RESTAURANT_ID,
        type: 'kot',
        order_id: 'order123',
        item: 'Pizza',
      };

      // Step 1: Wait for registration before sending
      setTimeout(() => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(kotMessage));
        }
      }, 500);

      // Step 2: Listen for broadcast
      const handleMessage = (event) => {
        const receivedMessage = JSON.parse(event.data);
        expect(receivedMessage).toEqual(kotMessage);

        // Cleanup handler to prevent further logs after done()
        client.removeEventListener('message', handleMessage);

        done();
      };

      client.addEventListener('message', handleMessage);
    },
    5000
  );
});
