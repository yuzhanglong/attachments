import { BaseObject, MethodKeys, UrlData } from './types/common';
import { JsErrorReportData } from './types/js-error';

/**
 * 空函数
 *
 * @author yuzhanglong
 * @date 2021-08-22 20:46:34
 */
export const noop = () => {
  return undefined;
};


export const instanceOf = (a: any, b: any) => {
  if (b) {
    return a instanceof b;
  }
  return false;
};


export const isObject = (obj: any) => {
  return typeof obj === 'object' && obj !== null;
};

export const isFunction = (obj: any) => {
  return typeof obj === 'function';
};

export const getBrowserWindow = () => {
  if (isObject(window)) {
    return window;
  }
  return null;
};

export const getPerformance = () => {
  if (getBrowserWindow() && isObject(window.performance)) {
    return window.performance;
  }
  return null;
};

export const getPerformanceObserver = () => {
  if (getBrowserWindow() && isFunction(window.PerformanceObserver)) {
    return window.PerformanceObserver;
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

/**
 * 格式化错误信息，将其转换为简单对象
 *
 * @author yuzhanglong
 * @date 2021-08-24 22:59:27
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error
 * @param e 异常 ErrorEvent, 或者 PromiseRejectionEvent 实例
 * 前者来自 window.addEventListener('error') 的回调
 * 后者来自 window.addEventListener('unhandledrejection') 的回调
 */
export function formatError(e: ErrorEvent | PromiseRejectionEvent): JsErrorReportData {
  let error: Error;

  if (instanceOf(e, PromiseRejectionEvent)) {
    error = (e as PromiseRejectionEvent).reason;
  } else if (instanceOf(e, ErrorEvent)) {
    error = (e as ErrorEvent).error;
  } else {
    // @ts-ignore
    error = e.reason || e.error || {};
  }


  return {
    // 发生异常的时间戳
    timestamp: Date.now(),
    // 核心内容，包括堆栈错误信息
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  };
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

export const getPerformanceEntriesByName = (name: string) => {
  const performance = getPerformance();

  if (performance && isFunction(performance.getEntriesByName)) {
    return performance.getEntriesByName(name);
  }
  return [];
};


/**
 * 监听 performance 性能指标
 *
 * @author yuzhanglong
 * @date 2021-08-26 16:38:12
 * @param options 监听的选项，可以在这里配置监听目标
 * @param callback 监听回调
 * @param once 仅监听一次
 * @return Function 一个销毁监听器的函数，如果 performance API 不存在，则返回 noop
 *
 * 其中：
 * - callback 第一个参数是**某一个**性能指标
 * - callback 第二个参数是**某一段时间**的性能指标
 * - 当不支持 performance API 时，我们不进行任何动作
 *
 */
export const observePerformance = (
  options: PerformanceObserverInit,
  callback: (entry: PerformanceEntry, entryList: PerformanceEntry[]) => void,
  once: boolean = false,
) => {
  let destroy = noop;

  // 通过 observer 监听
  const PerformanceObserver = getPerformanceObserver();
  if (PerformanceObserver) {
    const observerInstance = new PerformanceObserver((list) => {
      // performanceEntries 是【某小一段时间】得到的性能结果
      // 我们再遍历他们，并逐一调用 callback, 这样上层调用者无需再额外处理
      const performanceEntries = list.getEntries();
      for (let i = 0; i < performanceEntries.length; i += 1) {
        const entry = performanceEntries[i];
        callback(entry, performanceEntries);
        if (once) {
          break;
        }
      }
    });

    observerInstance.observe(options);

    // 覆写销毁函数
    destroy = () => {
      observerInstance.disconnect();
    };
  }

  return {
    destroy: destroy,
  };
};
