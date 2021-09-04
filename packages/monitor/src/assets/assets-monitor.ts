/**
 * File: assets-monitor.ts
 * Description: 资源性能相关监控
 * Created: 2021-08-26 11:20:23
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { PERFORMANCE_ENTRY_TYPES } from '../constants';
import { AssetsMonitorOptions } from './types';
import { EventType } from '../types';
import { observePerformance } from '../utils/observe-performance';

export function createAssetsMonitor(options: AssetsMonitorOptions) {
  const observerOptions: PerformanceObserverInit = {
    entryTypes: [PERFORMANCE_ENTRY_TYPES.RESOURCE],
  };

  const destroy = observePerformance(observerOptions, (entryList) => {
    entryList.forEach(entry => {
      options.onReport({
        data: {
          timeStamp: Date.now(),
          performance: entry,
        },
        eventType: EventType.ASSETS,
      });
    });
  });

  return {
    destroy: destroy,
  };
}

