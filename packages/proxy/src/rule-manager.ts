/**
 * File: rule-manager.ts
 * Description: rule 的管理类
 * Created: 2021-08-12 16:26:53
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */
import { URL } from 'url';
import { RuleConfig } from './types';
import { comparePathAndGetDivision, getUrlPaths, removeWWW } from './utils';

export class RuleManager {
  private mapDomainToRules = new Map<string, RuleConfig[]>();

  /**
   * 添加一条规则
   *
   * @author yuzhanglong
   * @date 2021-08-12 22:20:01
   * @param domain 域名
   * @param ruleConfig 规则配置
   */
  addRule(domain: string, ...ruleConfig: RuleConfig[]) {
    // 去掉前面的 www（如果有的话）
    const domainWithoutWWW = removeWWW(domain);

    let totConfig;

    if (this.mapDomainToRules.has(domainWithoutWWW)) {
      totConfig = this.mapDomainToRules.get(domainWithoutWWW);
      totConfig.push(...ruleConfig);
    } else {
      totConfig = [...ruleConfig];
      this.mapDomainToRules.set(domainWithoutWWW, totConfig);
    }

    // 将所有的 rules 根据 location 的 path 进行排序，至于这样做的意义，来看下面的例子：
    // server.addRule(
    //   'baidu.com',
    //   {
    //     location: '/',
    //     proxyPass: 'http://localhost:8001',
    //   },
    //   {
    //     location: '/hello/world',
    //     proxyPass: 'http://localhost:8001/hello_world',
    //   },
    // );
    // 假如我们访问了 baidu.com，匹配了第一个，符合预期
    // 假如我们访问了 baidu.com/hello/world，如果不加以排序，可能会匹配到第一个，但实际上我们期望的是第二个
    // 总而言之，我们要匹配[更详细]的路径
    totConfig.sort((a, b) => {
      const pathA = getUrlPaths(a.location);
      const pathB = getUrlPaths(b.location);
      return pathB.length - pathA.length;
    });
  }

  /**
   * 给定一个 domain，获取它手下的所有注册的规则
   *
   * @author yuzhanglong
   * @param domain 需要匹配的域名，注意，不要包含后面的内容
   * @date 2021-08-12 16:41:08
   */
  matchRuleConfigurations(domain: string) {
    // 去掉前面的 www（如果有的话）
    const domainWithoutWWW = removeWWW(domain);
    const targetRules = this.mapDomainToRules.get(domainWithoutWWW);
    if (!targetRules) {
      return null;
    }
    return targetRules;
  }

  getProxyPassUrl(urlInstance: URL): URL | null {
    const { host, pathname } = urlInstance;

    // 实际服务器地址的 paths
    const urlPaths = getUrlPaths(pathname);

    const targetRules = this.matchRuleConfigurations(removeWWW(host));

    if (!targetRules) {
      return null;
    }

    for (const targetRule of targetRules) {
      const { location, proxyPass } = targetRule;

      const locationPaths = getUrlPaths(location);

      const { dividedPos, otherPaths } = comparePathAndGetDivision(urlPaths, locationPaths);

      if (dividedPos >= 0) {
        const proxyPassRes = proxyPass.endsWith('/') ? proxyPass : `${proxyPass}/`;
        const url = new URL(`${proxyPassRes}${otherPaths.join('/')}`);

        url.search = urlInstance.search;

        const isWebSocketProtocol = urlInstance.protocol === 'wss:' || urlInstance.protocol === 'ws:';
        if (isWebSocketProtocol) {
          // 如果是 ws 或者 wss 服务，在匹配到结果之后我们会把匹配到的规则的 url 的协议进行强制转换
          // 我们会以 用户配置的 proxyPassUrl 是 http 还是 https 来决定是 ws 还是 wss
          url.protocol = proxyPass.startsWith('https://') ? 'wss:' : 'ws:';
        }

        return url;
      }
    }
    return null;
  }

  clear() {
    this.mapDomainToRules.clear();
  }
}
