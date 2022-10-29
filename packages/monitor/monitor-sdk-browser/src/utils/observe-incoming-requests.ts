import type { PatchedXMLHttpRequest } from '../tti/types';
import { patchMethod } from './patch-method';

/**
 * 使用劫持方式监听正在进行中的请求
 *
 * @author yuzhanglong
 * @date 2021-09-06 17:59:14
 * @return incomingRequests 一个对象，唯一的 key 代表某个进行中的请求
 * 如果是 **XMLHttpRequest**, 为偶数，如果是 **fetch** 则为奇数，对应的 value 为这次请求开始的时间戳
 * @return getIncomingRequestsTimes 基于所有 incomingRequests 的 value 合并得到的一个数组
 */
export const observeIncomingRequests = () => {
  const incomingRequests: Record<number, number> = {};

  // 监听 XMLHttpRequest open 方法
  patchMethod(XMLHttpRequest.prototype, 'open', (origin: XMLHttpRequest['open']) => {
    return function (this: PatchedXMLHttpRequest, ...args: Parameters<XMLHttpRequest['open']>) {
      const [method] = args;
      this.taggedMethod = method;
      return origin.apply(this, args);
    } as any;
  })();

  // 监听 XMLHttpRequest send 方法
  patchMethod(XMLHttpRequest.prototype, 'send', (origin) => {
    let uniqueId = 0;
    return function (this: PatchedXMLHttpRequest, ...args: Parameters<XMLHttpRequest['send']>) {
      if (this.taggedMethod !== 'GET')
        return origin.apply(this, args);

      // uniqueId 为偶数
      uniqueId += 2;
      const reqId = uniqueId;

      incomingRequests[reqId] = Date.now();

      patchMethod(this, 'onreadystatechange', (origin) => {
        return function (e) {
          origin.call(this, e);
          if (this.readyState === XMLHttpRequest.DONE) {
            // 从【进行中】表中移除
            delete incomingRequests[reqId];
          }
        };
      })();

      return origin.apply(this, args);
    };
  })();

  // 监听 window.fetch 方法
  patchMethod(window, 'fetch', (origin: typeof window['fetch']) => {
    let uniqueId = 0;
    return function (...args: Parameters<typeof window['fetch']>) {
      const [request, init] = args;
      const method = (request as Request)?.method || init.method;
      if (method !== 'GET')
        return origin(...args);

      return new Promise<Response>((resolve, reject) => {
        uniqueId += 2;
        const reqId = uniqueId;
        incomingRequests[reqId] = Date.now();

        origin(...args)
          .then((value) => {
            delete incomingRequests[reqId];
            resolve(value);
          })
          .catch((e) => {
            delete incomingRequests[reqId];
            reject(e);
          });
      });
    };
  })();

  const getIncomingRequestsTimes = (): number[] => {
    const entries = Object.entries(incomingRequests);
    return entries.map((res) => {
      return res[1];
    });
  };

  return {
    incomingRequests,
    getIncomingRequestsTimes,
  };
};
