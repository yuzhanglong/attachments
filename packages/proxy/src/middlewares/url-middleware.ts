/**
 * File: resolve-req-url.ts
 * Description: req 参数的 url 属性不包含主机名，我们要进行额外的加工，注意，后面关于 url 的一切参数都从这边获取
 * Created: 2021-08-11 15:04:19
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */
import { ProxyServerContext, ProxyServerMiddleware } from '../types';

export function createUrlMiddleWare(): ProxyServerMiddleware {
  return async (ctx: ProxyServerContext, next) => {
    const { req, protocol } = ctx;

    if (!protocol) {
      throw new Error('please give us a protocol!');
    }

    const host = req.headers.host || '';
    // origin 指 协议 + 主机的形式
    const origin = `${protocol}://${host}`;
    // req.url 为 nodejs 的 API，指的是 url 串除了 origin 一部分（search、params 所在的地方）
    ctx.urlInstance = new URL(req.url, origin);

    // 略去 80 端口
    if (ctx.urlInstance.port === '80') {
      ctx.urlInstance.port = '';
    }

    await next();
  };
}
