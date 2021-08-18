/**
 * File: proxy-rule-middleware.ts
 * Description: 代理规则中间件
 * Created: 2021-08-12 10:57:34
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { ProxyServerMiddleware } from '../types';
import { RuleManager } from '../rule-manager';

export function createProxyRuleMiddleware(ruleManager: RuleManager): ProxyServerMiddleware {
  return async (context, next) => {
    const { urlInstance } = context;

    const resUrl = ruleManager.getProxyPassUrl(urlInstance);

    if (resUrl) {
      console.log(`[proxy-make-effect] ${urlInstance.toString()} => ${resUrl.toString()}`);
      context.urlInstance = resUrl;
    }
    return next();
  };
}
