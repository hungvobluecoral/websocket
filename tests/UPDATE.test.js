import WebSocket from 'ws';

const WS_PORT = 8081;

describe('UPDATE Message', () => {
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
