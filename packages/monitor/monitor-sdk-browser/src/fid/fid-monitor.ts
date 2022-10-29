import { first } from 'lodash';
import { getPerformanceObserver } from '../utils/browser-interfaces';
import { observePerformance } from '../utils/observe-performance';
import { PERFORMANCE_ENTRY_TYPES } from '../constants';
import { getPerformanceEntriesByType } from '../utils/performance-entry';
import { EventType } from '../types';
import type { FIDEntry, FIDMonitorOptions } from './types';

/**
 * 创建 fid 监听器
 *
 * @author yuzhanglong
 * @date 2021-11-10 23:39:55
 */
export const createFIDMonitor = (options: FIDMonitorOptions) => {
  if (!getPerformanceObserver())
    return;

  const reportData = (entry: FIDEntry) => {
    if (!entry)
      return;

    options.onReport({
      data: {
        fid: entry,
      },
      eventType: EventType.FID,
    });
  };

  const observeFID = () => {
    observePerformance(
      {
        entryTypes: [PERFORMANCE_ENTRY_TYPES.FIRST_INPUT],
      },
      (entryList) => {
        const entry = first(entryList);
        reportData(entry as FIDEntry);
      },
      true,
    );
  };

  const getFIDDirectly = () => {
    return first(getPerformanceEntriesByType(PERFORMANCE_ENTRY_TYPES.FIRST_INPUT));
  };

  // 先尝试直接获取，如果没有再开启监听器
  const entry = getFIDDirectly();
  if (!entry)
    observeFID();
  else
    reportData(entry as FIDEntry);
};
