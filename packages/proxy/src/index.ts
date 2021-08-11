import { ProxyServer } from './proxy-server';


async function runApp() {
  const server = new ProxyServer();
  await server.initServers();
  await server.listen();
}

runApp();
