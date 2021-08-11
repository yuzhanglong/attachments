import { IncomingMessage, ServerResponse } from 'http';
import { Middleware } from 'koa-compose';

export interface ProxyServerContext {
  req: IncomingMessage;
  res: ServerResponse;
  protocol?: string;
  urlInstance?: URL;
}


export type Next = () => Promise<any>

export type ProxyServerMiddleware = Middleware<ProxyServerContext>
