import WebSocket from 'ws';

const WS_PORT = 8081;

describe('WAITER Message', () => {
  let client;

  beforeEach((done) => {
    client = new WebSocket(`ws://localhost:${WS_PORT}`);
    client.onopen = () => {
      done();
    };
  });

  afterEach((done) => {
    client.close();
    done();
  });

  test('should broadcast WAITER message to all clients in the same restaurant', (done) => {
    const restaurantId = 'restaurant123';
    const waiterMessage = {
      restaurant_id: restaurantId,
      type: 'waiter',
      table_number: 5,
      request: 'Water please',
    };

    client.send(JSON.stringify(waiterMessage));

    client.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      expect(receivedMessage).toEqual(waiterMessage);
      done();
    };
  });
});
