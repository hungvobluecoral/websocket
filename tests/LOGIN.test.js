import WebSocket from 'ws';

const WS_PORT = 8081;

describe('LOGIN Message', () => {
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
});
