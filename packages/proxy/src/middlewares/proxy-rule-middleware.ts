import { URL } from 'url';
import { ProxyServerMiddleware, RuleConfig } from '../types';
import { removeWWW } from '../utils';

/**
 * File: proxy-rule-middleware.ts
 * Description: 代理规则中间件
 * Created: 2021-08-12 10:57:34
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


export function createProxyRuleMiddleware(rules: RuleConfig[]): ProxyServerMiddleware {
  return async (context, next) => {
    const {
      urlInstance: {
        host,
        protocol
      },
    } = context;

    // 移除开头的 3w
    const hostWithoutWWW = removeWWW(host);
    await next();
  };
}
