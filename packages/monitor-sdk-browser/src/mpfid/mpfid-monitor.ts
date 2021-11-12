import { first } from 'lodash';
import { observePerformance } from '../utils/observe-performance';
import { getPerformance, getPerformanceObserver } from '../utils/browser-interfaces';
import { PERFORMANCE_ENTRY_TYPES } from '../constants';
import { MPFIDMonitorOptions } from './types';
import { getPerformanceEntriesByName } from '../utils/performance-entry';
import { EventType } from '../types';
import { onPageLoad } from '../utils/on-page-load';

export const MPFID_REPORT_TIMEOUT_AFTER_ONLOAD = 200;

/**
 * 初始化 MPFID 监听器
 *
 * @author yuzhanglong
 * @date 2021-11-11 00:55:37
 */
export const createMPFIDMonitor = (options: MPFIDMonitorOptions) => {
  if (!getPerformance() || !getPerformanceObserver()) {
    return;
  }

  const longTaskEntries: PerformanceEntry[] = [];

  const performanceOptions: PerformanceObserverInit = {
    entryTypes: [PERFORMANCE_ENTRY_TYPES.LONG_TASK],
  };

  const destroy = observePerformance(performanceOptions, (entryList) => {
    entryList.forEach((entry) => {
      longTaskEntries.push(entry);
    });
  });

  // MPFID 衡量从用户首次与您的网站交互（例如单击按钮）到浏览器实际能够响应该交互的时间。
  // 通过查找 First Contentful Paint 之后最长任务的持续时间来计算 Max Potential FID。
  // First Contentful Paint 之前的任务被排除在外，
  // 因为用户不太可能在任何内容呈现到屏幕之前尝试与您的页面进行交互
  // 而这正是 First Contentful Paint 所衡量的。
  const getMPFID = () => {
    destroy();

    const fcp = first(getPerformanceEntriesByName(PERFORMANCE_ENTRY_TYPES.PAINT)) || 0;

    return longTaskEntries.reduce((res, entry) => {
      const { duration, startTime } = entry;
      const isBeforeFCP = startTime < fcp;
      return res < duration && !isBeforeFCP ? duration : res;
    }, 0);
  };

  onPageLoad(async () => {
    await new Promise((resolve) => {
      // 为提高性能，如果 onload 事件后 0.2s 还没有 FID，
      // 终止监听, 并将此时作为一个粗略的 FID
      // 因为在绝大部分情况下 onload 事件结束之前用户应该已经开始和页面交互
      onPageLoad(() => {
        setTimeout(() => {
          resolve(true);
        }, options.timeout || MPFID_REPORT_TIMEOUT_AFTER_ONLOAD);
      });
    });

    options.onReport({
      eventType: EventType.MPFID,
      data: {
        mpfid: getMPFID(),
      },
    });
  });
};
