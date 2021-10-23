import { UrlData } from '../types';
import { getBrowserWindow } from './browser-interfaces';
import { assignKeysBetweenObjects } from './assign-keys-between-objects';

export const getUrlData = (url: string): UrlData => {
  // 支持 url
  const keys: string[] = ['hash', 'host', 'hostname', 'href', 'origin', 'pathname', 'port', 'protocol', 'search'];

  const res = {
    url: url,
    hash: '',
    host: '',
    hostname: '',
    href: '',
    origin: '',
    pathname: '',
    port: '',
    protocol: '',
    search: '',
  };

  const w = getBrowserWindow();

  // 这里不推荐用浏览器内置的 URL 实例，而是利用原生 a 标签的特性来实现
  // 因为像下面 img 标签这样的错误，拿到的 "url" 是不规范的，使用 new URL() 会抛出异常
  // <img src="i_am_not_a_url"/>
  if (w && w.document) {
    const a = document.createElement('a');
    a.href = url;
    assignKeysBetweenObjects(a, res, keys);
  }
  return res;
};
