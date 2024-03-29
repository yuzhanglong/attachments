/**
 * File: utils.ts
 * Description: 常用工具函数
 * Created: 2021-08-12 15:55:26
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

export function removeWWWAndProtocol(url: string) {
  const data = url.split(/^https?:\/\/www\.|^www\.|^https?:\/\//);
  return data.pop();
}

export function getUrlPaths(url: string) {
  let u = url;
  if (u.endsWith('/')) {
    // www.baidu.com/foo/bar/ => www.baidu.com/foo/bar
    u = u.slice(0, -1);
  }
  // www.baidu.com/foo/bar => [www.baidu.com, foo, bar]
  const tmp = u.split('/');
  // [www.baidu.com, foo, bar] => [foo, bar]
  tmp.splice(0, 1);
  return tmp;
}

/**
 * 给定一个 basePath 和一个 providedPath, 判断 providePath 的全段是否为 base 的子集（起始 position 要相同）
 * base ['foo', 'bar', 'baz', 'quz']
 * provide ['foo', 'bar', 'baz']
 * return {samePaths:['foo', 'bar', 'baz'], otherPaths: ['quz']}
 * @author yuzhanglong
 * @date 2021-08-13 00:19:11
 */
export function comparePathAndGetDivision(basePath: string[], providedPath: string[]) {
  // provide 的长度大于 base, 肯定匹配不到
  if (providedPath.length > basePath.length) {
    return {
      samePaths: [],
      otherPaths: [],
      dividedPos: -1,
    };
  }

  // provide 的长度为 0，必然可以匹配的到，例如：
  // www.baidu.com/foo/bar => [foo, bar] => base path
  // / => []
  if (providedPath.length === 0) {
    return {
      samePaths: [],
      otherPaths: basePath.slice(),
      dividedPos: 0,
    };
  }

  let dividedPos = -1;
  for (let i = 0; i < providedPath.length; i += 1) {
    if (providedPath[i] === basePath[i])
      dividedPos = i + 1;
    else
      break;
  }

  return {
    samePaths: dividedPos === -1 ? [] : basePath.slice(0, dividedPos),
    otherPaths: dividedPos === -1 ? [] : basePath.slice(dividedPos),
    dividedPos,
  };
}

/**
 * 分离 connect 方法的 url
 *
 * @author yuzhanglong
 * @date 2021-10-18 00:16:10
 */
export const divideConnectMethodReqUrl = (url: string) => {
  const [domain, port] = url.split(':');
  return {
    domain,
    port: port ? parseInt(port, 10) : 443,
  };
};
