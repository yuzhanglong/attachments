import { ProxyServer } from '../../src';

async function runApp() {
  const server = new ProxyServer();
  // 当访问 ws://proxy.yuzzl.top 时，代理到 https://localhost:10000
  server.addRule(
    'proxy.yuzzl.top',
    {
      location: '/',
      // 即使这里写了 http 或者 https 对于 websocket 请求，我们会将其转换成 ws 或者 wss
      proxyPass: 'https://localhost:10000',
    }
  );

  await server.initServers();
  await server.listen();
}

runApp().catch(e => {
  console.log(e);
});
