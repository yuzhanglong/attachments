import { last } from 'lodash';
import { getPerformance, getPerformanceObserver, getXMLHttpRequest } from '../utils/browser-interfaces';
import { getPerformanceEntriesByName } from '../utils/performance-entry';
import { EventType } from '../types';
import { createScheduler } from '../utils/create-scheduler';
import { calculateTTI } from '../utils/calculate-tti';
import { computeLastKnownNetwork2Busy } from '../utils/compute-last-known-network-2-busy';
import { observeIncomingRequests } from '../utils/observe-incoming-requests';
import { observeLongTaskAndResources } from '../utils/observe-long-task-and-resources';
import type { TTIMonitorOptions, TaskTimeInfo } from './types';

const TIME_GAP = 5000;

export const getFCP = () => {
  const fcp = getPerformanceEntriesByName('first-contentful-paint')[0];
  return fcp ? fcp.startTime : 0;
};

/**
 * 上报 tti
 *
 * @author yuzhanglong
 * @date 2021-09-06 17:56:44
 * @param options 选项
 * @param lastKnownNetwork2Busy
 * @param longTasks
 */
const checkAndReportTTI = (options: TTIMonitorOptions, lastKnownNetwork2Busy: number, longTasks: TaskTimeInfo[]) => {
  const searchStartTime = getFCP();
  const tti = calculateTTI({
    searchStart: searchStartTime,
    checkTimeInQuiteWindow: performance.now(),
    longTasks,
    lastKnownNetwork2Busy,
  });

  options.onReport({
    eventType: EventType.TTI,
    data: {
      tti,
    },
  });
};

export const createTTIMonitor = (options: TTIMonitorOptions) => {
  const XMLHttpRequest = getXMLHttpRequest();
  const performanceObserver = getPerformanceObserver();
  const performance = getPerformance();

  if (!XMLHttpRequest || !performanceObserver || !performance)
    return;

  const longTasks: TaskTimeInfo[] = [];
  const networkRequests: TaskTimeInfo[] = [];

  const ttiCalculatorScheduler = createScheduler();
  const { getIncomingRequestsTimes } = observeIncomingRequests();

  const getLastKnownNetworkBusy = () => {
    return computeLastKnownNetwork2Busy(getIncomingRequestsTimes(), networkRequests);
  };

  // 监听 long task 和 network resource
  observeLongTaskAndResources(
    (timeInfo) => {
      // 在 long task 5 秒 后尝试获取 tti
      longTasks.push(timeInfo);
      ttiCalculatorScheduler.resetScheduler(timeInfo.endTime + TIME_GAP);
    },
    (timeInfo) => {
      networkRequests.push(timeInfo);
      // 遇到资源请求，在最后一次请求数大于 2 的时刻五秒后尝试获取 tti
      ttiCalculatorScheduler.resetScheduler(getLastKnownNetworkBusy() + TIME_GAP);
    },
  );

  const checkAndReport = () => {
    checkAndReportTTI(options, getLastKnownNetworkBusy(), longTasks);
  };

  const lastLongTask = last(longTasks)?.endTime || 0;

  ttiCalculatorScheduler.startSchedule(checkAndReport, Math.max(getLastKnownNetworkBusy() + TIME_GAP, lastLongTask));
};
