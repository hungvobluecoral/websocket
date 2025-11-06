import WebSocket from 'ws';

const WS_PORT = 8081;

describe('WebSocket Server', () => {
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

  test('should broadcast KOT message to all clients in the same restaurant', (done) => {
    const restaurantId = 'restaurant123';
    const kotMessage = {
      restaurant_id: restaurantId,
      type: 'kot',
      order_id: 'order123',
      item: 'Pizza',
    };

    client.send(JSON.stringify(kotMessage));

    client.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      expect(receivedMessage).toEqual(kotMessage);
      done();
    };
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

  test('should send LOGIN message to a specific customer', (done) => {
    const uuid = 'customer789';
    const loginMessage = {
      uuid: uuid,
    };

    client.send(JSON.stringify(loginMessage));

    client.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      expect(receivedMessage).toEqual(loginMessage);
      done();
    };
  });

  test('should send UPDATE message to a specific customer', (done) => {
    const uuid = 'customer789';
    const updateMessage = {
      uuid: uuid,
      type: 'update',
    };

    client.send(JSON.stringify(updateMessage));

    client.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      expect(receivedMessage).toEqual(updateMessage);
      done();
    };
  });
});
