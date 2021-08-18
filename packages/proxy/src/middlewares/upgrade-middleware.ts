/**
 * File: upgrade-middleware.ts
 * Description: 处理 http upgrade 中间件（例如 websocket）
 * Created: 2021-08-17 10:56:16
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */
import { RequestOptions } from 'https';
import * as https from 'https';
import * as http from 'http';
import { ProxyServerMiddleware } from '../types';

function createHttpHeader(
  line: string,
  headers: Record<string, any>,
) {
  return (
    `${Object.keys(headers)
      .reduce(
        (head, key) => {
          const value = headers[key];

          if (!Array.isArray(value)) {
            head.push(`${key}: ${value}`);
            return head;
          }

          for (let i = 0; i < value.length; i += 1) {
            head.push(`${key}: ${value[i]}`);
          }
          return head;
        },
        [line],
      )
      .join('\r\n')}\r\n\r\n`
  );
}

export function createUpgradeMiddleware(): ProxyServerMiddleware {
  return async (ctx, next) => {
    const { socket, req, head, urlInstance } = ctx;
    // 不是 websocket 服务，进入下一个中间件
    if (urlInstance.protocol !== 'wss:' && urlInstance.protocol !== 'ws:') {
      return next();
    }

    const isSSL = urlInstance.protocol === 'wss:';

    // 参考: https://github.com/http-party/node-http-proxy
    // ws 只支持 GET 方法，携带 upgrade 头
    if (req.method !== 'GET' || !req.headers.upgrade) {
      return socket.destroy();
    }

    // upgrade 请求只支持 websocket
    if (req.headers.upgrade.toLowerCase() !== 'websocket') {
      return socket.destroy();
    }

    socket.setTimeout(0);
    socket.setNoDelay(true);
    socket.setKeepAlive(true, 0);

    if (head && head.length) {
      socket.unshift(head);
    }

    const defaultPort = isSSL ? 443 : 80;

    const reqOptions: RequestOptions = {
      method: req.method,
      host: urlInstance.host,
      port: urlInstance.port || defaultPort,
      timeout: 3000,
      path: urlInstance.pathname,
      headers: req.headers,
      hostname: urlInstance.hostname,
      agent: false,
      rejectUnauthorized: false,
    };

    const client = isSSL ? https : http;

    const requestToRealServer = client.request(reqOptions);

    const errorHandler = (e: Error) => {
      console.log(e);
      socket.end();
    };

    requestToRealServer.on('error', errorHandler);

    requestToRealServer.on('response', (res) => {
      // @ts-ignore
      if (!res.upgrade) {
        socket.write(
          createHttpHeader(
            `HTTP/${res.httpVersion} ${res.statusCode} ${res.statusMessage}`,
            res.headers,
          ),
        );
        res.pipe(socket);
      }
    });

    requestToRealServer.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
      proxySocket.on('error', errorHandler);

      socket.on('error', () => {
        proxySocket.end();
      });

      proxySocket.setTimeout(0);
      proxySocket.setNoDelay(true);
      proxySocket.setKeepAlive(true, 0);

      if (proxyHead && proxyHead.length) {
        proxySocket.unshift(proxyHead);
      }

      socket.write(
        createHttpHeader(`HTTP/1.1 101 Switching Protocols`, proxyRes.headers),
      );
      proxySocket.pipe(socket).pipe(proxySocket);
    });

    req.pipe(requestToRealServer);
  };
}
