import { IncomingMessage, ServerResponse } from 'http';
import { Middleware } from 'koa-compose';
import { Socket } from 'net';

export interface ProxyServerContext {
  // for http(s)
  incomingRequestData: IncomingMessage;
  proxyServerResponse?: ServerResponse;
  protocol?: string;
  urlInstance?: URL;
  // for websocket
  socketBetweenClientAndProxyServer?: Socket;
  head?: Buffer;
}

export interface RuleConfig {
  location: string;
  proxyPass: string;
}

export type ProxyServerMiddleware = Middleware<ProxyServerContext>;
