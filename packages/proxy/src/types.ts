import type { IncomingMessage, ServerResponse } from 'http';
import type { Socket } from 'net';
import type { Middleware } from 'koa-compose';

export interface ProxyServerContext {
  // for http(s)
  incomingRequestData: IncomingMessage
  proxyServerResponse?: ServerResponse
  protocol?: string
  urlInstance?: URL
  // for websocket
  socketBetweenClientAndProxyServer?: Socket
  head?: Buffer
}

export interface RuleConfig {
  location: string
  proxyPass: string
}

export type ProxyServerMiddleware = Middleware<ProxyServerContext>;
