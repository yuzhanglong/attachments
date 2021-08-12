/**
 * File: rule-manager.ts
 * Description: rule 的管理类
 * Created: 2021-08-12 16:26:53
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */
import { RuleConfig } from './types';
import { removeWWW } from './utils';
import {URL} from 'url';

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

    if (this.mapDomainToRules.has(domainWithoutWWW)) {
      const totConfig = this.mapDomainToRules.get(domainWithoutWWW);
      totConfig.push(...ruleConfig);
    } else {
      const totConfig = [...ruleConfig];
      this.mapDomainToRules.set(domainWithoutWWW, totConfig);
    }
  }

  /**
   * 尝试通过 domain 匹配规则
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
    const {host, pathname} = urlInstance;
    // 统一去除前面的斜杠
    const pathNameRes = pathname.startsWith('/') ? pathname.slice(1): pathname;

    const targetRules = this.matchRuleConfigurations(removeWWW(host));
    if (!targetRules) {
      return null;
    }

    for (const targetRule of targetRules) {
      const { location, proxyPass } = targetRule;
      // 统一去除前面的斜杠
      const locationRes = location.startsWith('/') ? location.slice(1) : location;
      const locationPaths = locationRes.split('/');

      const unchangeableUrl = proxyPass;
      // 遍历 location 属性中配置的路径，逐一和传入的 url 的 paths 进行比对
      // 如果比对成功，则往 unchangeableUrl 后追加内容，反之 break
      for (let i = 0; i < locationPaths.length; i += 1) {
        // if(locationPaths[i] === )
      }
    }

    return new URL(``);
  }

  clear() {
    this.mapDomainToRules.clear();
  }
}
