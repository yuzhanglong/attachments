import { Server } from 'ws';

const wss = new Server({ port: 10000 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received: %s', message);
  });

  ws.send('something');
});
