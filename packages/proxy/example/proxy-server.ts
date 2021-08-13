import { ProxyServer } from '../src';

async function runApp() {
  const server = new ProxyServer();
  server.addRule(
    'baidu.com',
    {
      location: '/',
      proxyPass: 'http://localhost:8001',
    },
    {
      location: '/hello/world',
      proxyPass: 'http://localhost:8001/hello_world',
    },
  );
  await server.initServers();
  await server.listen();
}

runApp().catch(e => {
  console.log(e);
});
