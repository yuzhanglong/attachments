import { ProxyServer } from '../src';

async function runApp() {
  const server = new ProxyServer();
  // 当访问 baidu.com 时，代理到 http://localhost:8001
  // 当访问 baidu.com/hello/world/xxx 时，代理到 http://localhost:8001/hello_world/xxx
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
