import WebSocket from 'ws';

const WS_PORT = 8081;

describe('RESERVATION Message', () => {
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

  test('should broadcast RESERVATION message to all clients in the same restaurant', (done) => {
    const restaurantId = 'restaurant123';
    const reservationMessage = {
      restaurant_id: restaurantId,
      type: 'reservation',
      reservation_id: 'res456',
      customer_name: 'John Doe',
    };

    client.send(JSON.stringify(reservationMessage));

    client.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      expect(receivedMessage).toEqual(reservationMessage);
      done();
    };
  });
});
