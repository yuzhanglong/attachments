import * as https from 'https';
import * as http from 'http';
import { RequestOptions } from 'https';
import { ProxyServerContext, ProxyServerMiddleware } from '../types';

export function createProxyPassMiddleware(): ProxyServerMiddleware {
  return (ctx: ProxyServerContext) => {
    const { incomingRequestData, proxyServerResponse, urlInstance } = ctx;

    const client = urlInstance.protocol === 'https:' ? https : http;
    // 向真正的服务器发送消息

    const options: RequestOptions = {
      headers: incomingRequestData.headers,
      method: incomingRequestData.method,
      port: urlInstance.port,
      timeout: 3000,
      rejectUnauthorized: false,
    };

    const requestToRealServer = client.request(urlInstance.toString(), options, (realServerResponse) => {
      // 覆写 proxyServerResponse, 即用户实际接收到的内容
      proxyServerResponse.statusCode = realServerResponse.statusCode;
      proxyServerResponse.statusMessage = realServerResponse.statusMessage;

      // 添加 proxy 相关的请求头
      proxyServerResponse.setHeader('x-response-from', '@attachments/proxy');

      const headers = Object.entries(realServerResponse.headers);
      for (const [k, v] of headers) {
        proxyServerResponse.setHeader(k, v);
      }

      // 连接真实服务器的响应流(可读流)和代理服务器的响应流(可写流)
      realServerResponse.pipe(proxyServerResponse);

      realServerResponse.on('error', (e) => {
        console.log(e);
      });
    });

    requestToRealServer.end();

    requestToRealServer.on('error', (e) => {
      console.log(e);
    });
  };
}
