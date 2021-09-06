import { observePerformance } from '../utils/observe-performance';
import { getPerformance, getPerformanceObserver, getXMLHttpRequest } from '../utils/browser-interfaces';
import { getPerformanceEntriesByName } from '../utils/get-performance-entries-by-name';
import { PERFORMANCE_ENTRY_TYPES } from '../constants';
import { EventType } from '../types';
import { createScheduler } from '../utils/create-scheduler';
import { calculateTTI } from '../utils/calculate-tti';
import { patchMethod } from '../utils/patch-method';
import { TTIMonitorOptions } from './types';
import { computeLastKnownNetwork2Busy, ObservedResourceRequests } from '../utils/compute-last-known-network-2-busy';

/**
 * 上报 tti
 *
 * @author yuzhanglong
 * @date 2021-09-06 17:56:44
 * @param options 选项
 * @param networkRequests
 * @param incomingRequests
 * @param longTasks
 */

const checkAndReportTTI = (
  options: TTIMonitorOptions,
  networkRequests: ObservedResourceRequests[],
  incomingRequests: number[],
  longTasks: { startTime: number; endTime: number }[],
) => {
  const fcp = getPerformanceEntriesByName('first-contentful-paint')[0];
  const searchStartTime = fcp ? fcp.startTime : 0;


  const tti = calculateTTI({
    searchStart: searchStartTime,
    currentTime: performance.now(),
    longTasks: longTasks,
    lastKnownNetwork2Busy: computeLastKnownNetwork2Busy(incomingRequests, networkRequests),
  });

  options.onReport({
    eventType: EventType.TTI,
    data: {
      tti: tti,
    },
  });
};

/**
 * 监听长任务和资源请求
 *
 * @author yuzhanglong
 * @date 2021-09-06 17:37:20
 * @param onLongTask 在监听到长任务时做些什么
 * @param onNetworkRequest 在监听到网络请求后做些什么
 * @return object 返回一个对象，第一个参数是收集到的所有 long tasks 第二个参数是收集到的所有 requests
 */
export const observeLongTaskAndResources = (
  onLongTask: (entry: PerformanceEntry) => void,
  onNetworkRequest: (resourceEntry: PerformanceResourceTiming) => void,
) => {
  const longTasks: { startTime: number, endTime: number }[] = [];
  const networkRequests: { startTime: number, endTime: number }[] = [];

  observePerformance({
    entryTypes: [PERFORMANCE_ENTRY_TYPES.LONG_TASK, PERFORMANCE_ENTRY_TYPES.RESOURCE],
  }, (entryList) => {
    for (const entry of entryList) {
      if (entry.entryType === PERFORMANCE_ENTRY_TYPES.LONG_TASK) {
        const endTime = entry.startTime + entry.duration;
        longTasks.push({
          startTime: entry.startTime,
          endTime: endTime,
        });
        onLongTask(entry);
      } else if (entry.entryType === PERFORMANCE_ENTRY_TYPES.RESOURCE) {
        const { fetchStart, responseEnd } = entry as PerformanceResourceTiming;
        networkRequests.push({
          startTime: fetchStart,
          endTime: responseEnd,
        });
        onNetworkRequest(entry as PerformanceResourceTiming);
      }
    }
  });

  return {
    longTasks,
    networkRequests,
  };
};

/**
 * 使用劫持方式监听正在进行中的请求
 *
 * @author yuzhanglong
 * @date 2021-09-06 17:59:14
 */
export const observeIncomingRequests = () => {
  const incomingRequests = [];
  patchMethod(XMLHttpRequest.prototype, 'open', () => {
    return () => {

    };
  });

  return {
    incomingRequests,
  };

};

export const createTtiMonitor = (options: TTIMonitorOptions) => {
  const XMLHttpRequest = getXMLHttpRequest();
  const performanceObserver = getPerformanceObserver();
  const performance = getPerformance();

  if (!XMLHttpRequest || !performanceObserver || !performance) {
    return;
  }


  const ttiCalculatorScheduler = createScheduler();


  const { longTasks, networkRequests } = observeLongTaskAndResources();
  const { incomingRequests } = observeIncomingRequests();

  const networkRequestsTmp = networkRequests.map(res => {
    return {
      start: res.startTime,
      end: res.endTime,
    };
  });

  const checkAndReport = () => {
    checkAndReportTTI(
      options,
      networkRequestsTmp,
      incomingRequests,
      longTasks,
    );
  };

  ttiCalculatorScheduler.startSchedule(checkAndReport, 0);
};
