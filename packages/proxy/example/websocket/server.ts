import https from 'https';
import { Server } from 'ws';
import Koa from 'koa';
import { CertificationManager } from '../../src';

const app = new Koa();
const cm = new CertificationManager();

const run = async () => {
  const cfg = await cm.createCertificationByDomain('localhost');
  const server = https.createServer(
    {
      cert: cfg.cert,
      key: cfg.key,
    },
    app.callback(),
  );

  // 指定一个url匹配
  app.use(async (ctx) => {
    ctx.body
      = '<!DOCTYPE html>\n'
      + '<html lang=\'en\'>\n'
      + '<head>\n'
      + '  <meta charset=\'UTF-8\'>\n'
      + '  <title>Use Proxy For WebSocket</title>\n'
      + '</head>\n'
      + '<body>\n'
      + '<script>\n'
      + '  const ws = new WebSocket(\'wss://proxy.yuzzl.top\');\n'
      + '  ws.onopen = () => {\n'
      + '    console.log(\'open!\');\n'
      + '    ws.send(\'hello world!\')\n'
      + '  }\n'
      + '\n'
      + '</script>\n'
      + '\n'
      + '</body>\n'
      + '</html>\n';
  });

  const wss = new Server({
    server,
  });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      console.log('received: %s', message);
    });

    ws.send('something');
  });

  server.listen(10000);
};

run();
