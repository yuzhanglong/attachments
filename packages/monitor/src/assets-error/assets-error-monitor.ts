/**
 * File: assets-error-monitor.ts
 * Description: 资源监控器
 * Created: 2021-08-25 21:55:26
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */
import { AssetsErrorMonitorOptions } from './types';
import { EventType } from '../types';
import { getBrowserWindow } from '../utils/browser-interfaces';
import { getUrlData } from '../utils/get-url-data';
import { getPerformanceEntriesByName } from '../utils/get-performance-entries-by-name';

export const createAssetsErrorMonitor = (options: AssetsErrorMonitorOptions) => {
  const window = getBrowserWindow();

  if (!window) {
    return;
  }

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

    const srcAttr = target?.getAttribute('src');
    const hrefAttr = target?.getAttribute('href');

    return {
      tagName: tagName,
      url: srcAttr || hrefAttr,
    };
  };

  const errorListener = (e: ErrorEvent) => {
    const res = getErrorInfoFromErrorEvent(e);
    if (!res) {
      return;
    }

    const { url, tagName } = res;
    const urlData = getUrlData(url);
    const performance = getPerformanceEntriesByName(urlData.href).pop();

    const data = {
      tagName: tagName.toLowerCase(),
      timestamp: Date.now(),
      performance: performance,
      ...urlData,
    };

    options.onReport({
      data: data,
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
