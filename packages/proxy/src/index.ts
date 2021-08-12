import { ProxyServer } from './proxy-server';


async function runApp() {
  const server = new ProxyServer();
  server.addRule({
    domain: 'baidu.com',
    location: '/',
    proxyPass: 'http://demo.yuzzl.top/',
  });
  await server.initServers();
  await server.listen();
}

runApp();
