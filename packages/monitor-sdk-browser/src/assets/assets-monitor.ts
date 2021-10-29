import { PERFORMANCE_ENTRY_TYPES } from '../constants';
import { AssetsMonitorOptions } from './types';
import { EventType } from '../types';
import { observePerformance } from '../utils/observe-performance';
import { noop } from 'lodash';
import { onPageLoad } from '../utils/on-page-load';
import { getPerformanceEntriesByType } from '../utils/performance-entry';

/**
 * 资源性能相关监控
 *
 * @author yuzhanglong
 * @date 2021-10-29 23:19:38
 */
export function createAssetsMonitor(options: AssetsMonitorOptions) {
  const observerOptions: PerformanceObserverInit = {
    entryTypes: [PERFORMANCE_ENTRY_TYPES.RESOURCE],
  };

  const reportAll = (entryList: PerformanceEntry[]) => {
    entryList.forEach((entry) => {
      options.onReport({
        data: {
          timeStamp: Date.now(),
          performance: entry,
        },
        eventType: EventType.ASSETS,
      });
    });
  };

  let destroy = noop;

  const reportResourceInfoInitiative = () => {
    const res = getPerformanceEntriesByType(PERFORMANCE_ENTRY_TYPES.RESOURCE);
    reportAll(res);
  };

  // 为什么要基于 onload 后的资源监听 + onload 之前的资源主动获取的模式，而不是直接监听？
  // 第一：大量资源加载的发生时机一般都是网页的首屏加载
  // 第二：onload 事件会在 DOM 和所有的资源加载完成后触发，如果直接开启监听器必然会影响首屏性能
  // 对于 onload 之前的内容，在 onload 回调开始时直接使用 performance.getEntriesByType 获取
  onPageLoad(() => {
    reportResourceInfoInitiative();
    destroy = observePerformance(observerOptions, (entryList) => {
      reportAll(entryList);
    });
  });

  return {
    destroy: destroy,
  };
}
