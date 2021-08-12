/**
 * File: utils.ts
 * Description: 常用工具函数
 * Created: 2021-08-12 15:55:26
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

export function removeWWW(url: string) {
  if (!url.startsWith('www.')) {
    return url;
  }
  return url.slice(4);
}


export function getUrlPaths(url: string) {
  let u = url;
  if (u.endsWith('/')) {
    u = u.slice(0, -1);
  }
  // www.baidu.com/foo/bar => [www.baidu.com, foo, bar]
  const tmp = u.split('/');
  // [www.baidu.com, foo, bar] => [foo, bar]
  tmp.splice(0, 1);
  return tmp;
}
