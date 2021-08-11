import * as https from 'https';
import * as http from 'http';
import { ProxyServerContext, ProxyServerMiddleware } from '../types';

export function createProxyPassMiddleware(): ProxyServerMiddleware {
  return (ctx: ProxyServerContext) => {
    const { req, res, urlInstance } = ctx;

    const client = urlInstance.protocol === 'https:' ? https : http;
    // 向真正的服务器发送消息
    const requestToRealServer = client.request(urlInstance, {
      headers: req.headers,
      method: req.method,
      port: urlInstance.port,
      timeout: 3000,
      rejectUnauthorized: false,
    }, (serverResponse) => {
      // 覆写 res
      res.statusCode = serverResponse.statusCode;
      res.setHeader('x-response-from', 'yzl-proxy');

      const headers = Object.entries(serverResponse.headers);
      for (const [k, v] of headers) {
        res.setHeader(k, v);
      }
      serverResponse.pipe(res);

      serverResponse.on('error', (e) => {
        console.log(e);
      });
    });

    req.pipe(requestToRealServer);

    requestToRealServer.on('error', (e) => {
      console.log(e);
    });
  };
}
