import { IncomingMessage, ServerResponse } from 'http';
import { Middleware } from 'koa-compose';
import { Socket } from 'net';

export interface ProxyServerContext {
  // for http(s)
  req: IncomingMessage;
  res?: ServerResponse;
  protocol?: string;
  urlInstance?: URL;
  // for websocket
  socket?: Socket;
  head?: Buffer
}

export interface RuleConfig {
  location: string;
  proxyPass: string;
}

export type ProxyServerMiddleware = Middleware<ProxyServerContext>
