import { EventType } from '../types';
import { getBrowserWindow } from '../utils/browser-interfaces';
import { getUrlData } from '../utils/get-url-data';
import { getPerformanceEntriesByName } from '../utils/performance-entry';
import type { AssetsErrorMonitorOptions } from './types';

/**
 * 初始化资源异常监听器
 *
 * @author yuzhanglong
 * @date 2021-08-25 21:55:26
 * @param options 初始化选项
 */
export const createAssetsErrorMonitor = (options: AssetsErrorMonitorOptions) => {
  // 保证 window 存在
  const window = getBrowserWindow();

  if (!window)
    return;

  // 从捕获到的 error 时间中筛选出有用的异常信息，如果这个 error 和资源异常无关，我们返回 undefined
  const getErrorInfoFromErrorEvent = (e: ErrorEvent) => {
    const target = e.target as HTMLElement;

    const tagName = target.tagName;

    const isSourceErrorEvent = target && tagName;

    if (!isSourceErrorEvent) {
      // 在通过 window.addEventListener('error') 捕获的同时
      // 一些非静态资源造成的异常也被捕获进来
      // 而这些异常应该在 js-error-monitor 处理
      return;
    }

    // 一般情况下资源属性为 src
    const srcAttr = target?.getAttribute('src');
    // link 标签（常用于加载 css）的 href 属性会指向资源路径
    const hrefAttr = target?.getAttribute('href');

    return {
      tagName,
      url: srcAttr || hrefAttr,
    };
  };

  const errorListener = (e: ErrorEvent) => {
    const res = getErrorInfoFromErrorEvent(e);
    if (!res)
      return;

    const { url, tagName } = res;
    const urlData = getUrlData(url);
    const performance = getPerformanceEntriesByName(urlData.href).pop();

    const data = {
      tagName: tagName.toLowerCase(),
      timestamp: Date.now(),
      performance,
      ...urlData,
    };

    // 上报
    options.onReport({
      data,
      eventType: EventType.ASSETS_ERROR,
    });
  };

  // 静态资源的异常加载不会冒泡到 window, 要在捕获阶段处理
  window.addEventListener('error', errorListener, true);

  const destroy = () => {
    window.removeEventListener('error', errorListener, false);
  };

  return {
    destroy,
  };
};
