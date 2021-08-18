import { IncomingMessage, ServerResponse } from 'http';
import { Middleware } from 'koa-compose';
import { Socket } from 'net';

export interface ProxyServerContext {
  req: IncomingMessage;
  res?: ServerResponse;
  socket?: Socket;
  protocol?: string;
  urlInstance?: URL;
  head?: Buffer
}

export interface RuleConfig {
  location: string;
  proxyPass: string;
}

export type ProxyServerMiddleware = Middleware<ProxyServerContext>
