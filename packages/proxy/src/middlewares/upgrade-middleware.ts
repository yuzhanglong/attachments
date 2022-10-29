/**
 * File: upgrade-middleware.ts
 * Description: 处理 http upgrade 中间件（例如 websocket）
 * Created: 2021-08-17 10:56:16
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */
import type { RequestOptions } from 'https';
import * as https from 'https';
import * as http from 'http';
import type { ProxyServerMiddleware } from '../types';

function createHttpHeader(line: string, headers: Record<string, any>) {
  return `${Object.keys(headers)
    .reduce(
      (head, key) => {
        const value = headers[key];

        if (!Array.isArray(value)) {
          head.push(`${key}: ${value}`);
          return head;
        }

        for (let i = 0; i < value.length; i += 1)
          head.push(`${key}: ${value[i]}`);

        return head;
      },
      [line],
    )
    .join('\r\n')}\r\n\r\n`;
}

export function createUpgradeMiddleware(): ProxyServerMiddleware {
  return async (ctx, next) => {
    const { socketBetweenClientAndProxyServer, incomingRequestData, head, urlInstance } = ctx;
    // 不是 websocket 服务，进入下一个中间件
    if (urlInstance.protocol !== 'wss:' && urlInstance.protocol !== 'ws:')
      return next();

    const isSSL = urlInstance.protocol === 'wss:';

    // 参考: https://github.com/http-party/node-http-proxy
    // ws 只支持 GET 方法，携带 upgrade 头
    if (incomingRequestData.method !== 'GET' || !incomingRequestData.headers.upgrade)
      return socketBetweenClientAndProxyServer.destroy();

    // Connection: Upgrade
    // Upgrade: websocket

    // upgrade 请求只支持 websocket
    if (incomingRequestData.headers.upgrade.toLowerCase() !== 'websocket')
      return socketBetweenClientAndProxyServer.destroy();

    // ws 连接时间不做限制
    socketBetweenClientAndProxyServer.setTimeout(0);
    socketBetweenClientAndProxyServer.setNoDelay(true);
    socketBetweenClientAndProxyServer.setKeepAlive(true, 0);

    if (head && head.length)
      socketBetweenClientAndProxyServer.unshift(head);

    const defaultPort = isSSL ? 443 : 80;

    const reqOptions: RequestOptions = {
      method: incomingRequestData.method,
      host: urlInstance.host,
      port: urlInstance.port || defaultPort,
      timeout: 3000,
      path: urlInstance.pathname,
      headers: incomingRequestData.headers,
      hostname: urlInstance.hostname,
      agent: false,
      rejectUnauthorized: false,
    };

    const client = isSSL ? https : http;

    const requestToRealServer = client.request(reqOptions);

    const errorHandler = (e: Error) => {
      console.log(e);
      socketBetweenClientAndProxyServer.end();
    };

    requestToRealServer.on('error', errorHandler);

    requestToRealServer.on('response', (res) => {
      // @ts-expect-error
      if (!res.upgrade) {
        socketBetweenClientAndProxyServer.write(
          createHttpHeader(`HTTP/${res.httpVersion} ${res.statusCode} ${res.statusMessage}`, res.headers),
        );
        res.pipe(socketBetweenClientAndProxyServer);
      }
    });

    // 服务端的返回
    // - HTTP/1.1 101 Switching Protocols
    // - Connection: Upgrade
    // - Upgrade: websocket
    requestToRealServer.on('upgrade', (proxyRes, socketBetweenProxyServerAndRealServer, proxyHead) => {
      socketBetweenProxyServerAndRealServer.on('error', errorHandler);

      socketBetweenClientAndProxyServer.on('error', () => {
        socketBetweenProxyServerAndRealServer.end();
      });

      socketBetweenProxyServerAndRealServer.setTimeout(0);
      socketBetweenProxyServerAndRealServer.setNoDelay(true);
      socketBetweenProxyServerAndRealServer.setKeepAlive(true, 0);

      if (proxyHead && proxyHead.length)
        socketBetweenProxyServerAndRealServer.unshift(proxyHead);

      // 向客户端响应服务升级
      socketBetweenClientAndProxyServer.write(createHttpHeader('HTTP/1.1 101 Switching Protocols', proxyRes.headers));
      socketBetweenProxyServerAndRealServer.pipe(socketBetweenClientAndProxyServer);
      socketBetweenClientAndProxyServer.pipe(socketBetweenProxyServerAndRealServer);
    });

    incomingRequestData.pipe(requestToRealServer);
  };
}
