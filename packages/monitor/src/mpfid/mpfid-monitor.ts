import { first } from 'lodash';
import { observePerformance } from '../utils/observe-performance';
import { getPerformance, getPerformanceObserver } from '../utils/browser-interfaces';
import { PERFORMANCE_ENTRY_TYPES } from '../constants';
import { MPFIDMonitorOptions } from './types';
import { onPageLoad } from '../utils/on-page-load';
import { getPerformanceEntriesByName } from '../utils/performance-entry';
import { EventType } from '../types';

export const createMPFIDMonitor = (options: MPFIDMonitorOptions) => {
  if (!getPerformance() || !getPerformanceObserver()) {
    return;
  }

  const longTaskEntries: PerformanceEntry[] = [];

  const performanceOptions: PerformanceObserverInit = {
    entryTypes: [PERFORMANCE_ENTRY_TYPES.LONG_TASK],
  };

  const destroy = observePerformance(
    performanceOptions,
    (entryList) => {
      entryList.forEach((entry) => {
        longTaskEntries.push(entry);
      });
    },
  );

  // MPFID 衡量从用户首次与您的网站交互（例如单击按钮）到浏览器实际能够响应该交互的时间。
  // 通过查找 First Contentful Paint 之后最长任务的持续时间来计算 Max Potential FID。
  // First Contentful Paint 之前的任务被排除在外，
  // 因为用户不太可能在任何内容呈现到屏幕之前尝试与您的页面进行交互
  // 而这正是 First Contentful Paint 所衡量的。
  const getMPFID = () => {
    destroy();

    const fcp = first(getPerformanceEntriesByName(PERFORMANCE_ENTRY_TYPES.PAINT)) || 0;

    const result = longTaskEntries.reduce((res, entry) => {
      const { duration, startTime } = entry;
      const isBeforeFCP = startTime < fcp;
      return res < duration && !isBeforeFCP ? duration : res;
    }, 0);

    options.onReport({
      eventType: EventType.MPFID,
      data: {
        mpfid: result,
      },
    });

  };

  onPageLoad(() => getMPFID());
};
