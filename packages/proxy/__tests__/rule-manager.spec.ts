// noinspection DuplicatedCode

import { RuleManager } from '../src/rule-manager';

describe('test rule manager', () => {
  const ruleManager = new RuleManager();

  beforeEach(() => {
    ruleManager.clear();
  });

  test('rule configurations match', () => {
    ruleManager.addRule('baidu.com', {
      proxyPass: 'yzl.top',
      location: '/',
    });

    expect(ruleManager.matchRuleConfigurations('www.baidu.com')).toBeTruthy();
    expect(ruleManager.matchRuleConfigurations('baidu.com')).toBeTruthy();
    // 二级域名
    expect(ruleManager.matchRuleConfigurations('foo.baidu.com')).toBeFalsy();
    expect(ruleManager.matchRuleConfigurations('google.com')).toBeFalsy();
    expect(ruleManager.matchRuleConfigurations('www.baidu.com.cn')).toBeFalsy();
  });

  test('rule match that domain start with www', () => {
    ruleManager.addRule('www.baidu.com', {
      proxyPass: 'foo.com',
      location: '/',
    });

    expect(ruleManager.matchRuleConfigurations('www.baidu.com')).toBeTruthy();
    expect(ruleManager.matchRuleConfigurations('baidu.com')).toBeTruthy();
    // 二级域名
    expect(ruleManager.matchRuleConfigurations('foo.baidu.com')).toBeFalsy();
    expect(ruleManager.matchRuleConfigurations('google.com')).toBeFalsy();
    expect(ruleManager.matchRuleConfigurations('www.baidu.com.cn')).toBeFalsy();
  });

  test('mapDomainToRules match same domain, we only match the first one', () => {
    ruleManager.addRule('www.baidu.com', {
      proxyPass: 'foo.com',
      location: '/',
    });

    ruleManager.addRule('baidu.com', {
      proxyPass: 'bar.com',
      location: '/',
    });

    const expectedProxyPass = ruleManager.matchRuleConfigurations('www.baidu.com')[0].proxyPass;
    expect(expectedProxyPass).toStrictEqual('foo.com');
  });

  test('getProxyPassUrl', () => {
    ruleManager.addRule('www.baidu.com', {
      proxyPass: 'http://foo.com',
      location: '/',
    });

    ruleManager.addRule('www.google.com', {
      proxyPass: 'https://hello.com',
      location: '/foo/bar',
    });

    const str = ruleManager.getProxyPassUrl(new URL('http://www.baidu.com/hello'));
    expect(str?.toString()).toStrictEqual('http://foo.com/hello');

    const str2 = ruleManager.getProxyPassUrl(new URL('http://www.google.com/foo/bar/baz'));
    expect(str2?.toString()).toStrictEqual('https://hello.com/baz');
  });

  test('match domain', () => {
    ruleManager.addRule('www.baidu.com', {
      proxyPass: 'http://foo.com',
      location: '/',
    });

    ruleManager.addRule('www.google.com', {
      proxyPass: 'https://hello.com',
      location: '/foo/bar',
    });

    expect(ruleManager.matchDomain('baidu.com')).toBeTruthy();
    expect(ruleManager.matchDomain('google.com')).toBeTruthy();

    expect(ruleManager.matchDomain('www.baidu.com')).toBeTruthy();
    expect(ruleManager.matchDomain('https://www.baidu.com')).toBeTruthy();
  });
});
