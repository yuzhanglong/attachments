import { BaseObject, MethodKeys } from './types/common';

/**
 * 空函数
 *
 * @author yuzhanglong
 * @date 2021-08-22 20:46:34
 */
export const noop = () => {
  return undefined;
};


export const isObject = (o: any) => {
  return typeof o === 'object' && o !== null;
};

export const getBrowser = () => {
  if (isObject(window)) {
    return window;
  }
  return null;
};

export const getPerformance = () => {
  if (getBrowser() && isObject(window.performance)) {
    return window.performance;
  }
  return null;
};


/**
 * patch 一个方法（方法劫持）
 *
 * @author yuzhanglong
 * @date 2021-08-22 20:41:45
 * @param obj 被劫持的对象
 * @param key 需要劫持的 key
 * @param patchFn 劫持回调，劫持回调返回一个函数（即覆盖后的函数），其中：
 * 回调的第一个参数为将要被覆盖的对象
 * 第二个参数为携带的参数（可选）
 * @return function 返回一个函数，当这个函数被调用后，劫持工作将被执行
 */
export const patchMethod = <O extends {}, K extends MethodKeys<O>, P extends any[]>(
  obj: O,
  key: K,
  patchFn: (origin: O[K], ...params: P) => O[K] & Function,
) => {
  return (...params: P) => {
    // eslint-disable-next-line no-param-reassign
    obj[key] = patchFn(obj[key], ...params);
  };
};


/**
 * 传入多个 key, 将 object1 对应的值赋值到 object2 对应的值
 *
 * @author yuzhanglong
 * @date 2021-08-23 00:47:02
 */
export const assignKeysBetweenObjects = (obj1: BaseObject, obj2: BaseObject, keys: string[]) => {
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    // eslint-disable-next-line no-param-reassign
    obj2[k] = obj1[k];
  }
};

/**
 * 格式化 headers 字符串，返回一个对象
 *
 * @author yuzhanglong
 * @date 2021-08-24 00:26:43
 */
export const formatPlainHeadersString = (headerStr: string) => {
  const headers = headerStr.trim().split(/[\r\n]+/);

  const headerMap = {};
  for (let i = 0; i < headers.length; i += 1) {
    const line = headers[i];
    const parts = line.split(': ');
    const header = parts.shift();
    headerMap[header] = parts.join(': ');
  }
  return headerMap;
};


export interface UrlData {
  hash: string,
  host: string,
  hostname: string,
  href: string,
  origin: string,
  pathname: string,
  port: string,
  protocol: string,
  search: string,
}

export const getUrlData = (url: string): UrlData => {
  // 支持 url
  const keys: string[] = [
    'hash',
    'host',
    'hostname',
    'href',
    'origin',
    'pathname',
    'port',
    'protocol',
    'search',
  ];

  const res = {
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

  const w = getBrowser();

  if (w && w.URL) {
    const instance = new URL(url);
    assignKeysBetweenObjects(instance, res, keys);
  } else if (w && w.document) {
    const a = document.createElement('a');
    a.href = url;
    assignKeysBetweenObjects(a, res, keys);
  }
  // TODO: 是否需要自定义 parser 兜底？
  return res;
};
