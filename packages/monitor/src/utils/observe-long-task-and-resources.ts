import { observePerformance } from './observe-performance';
import { PERFORMANCE_ENTRY_TYPES } from '../constants';
import { TaskTimeInfo } from '../tti/types';

/**
 * 监听长任务和资源请求
 *
 * @author yuzhanglong
 * @date 2021-09-06 17:37:20
 * @param onLongTask 在监听到长任务时做些什么，第一个回调参数为本次长任务的开始时间和结束时间，第二个为对应的 performanceEntry 对象
 * @param onNetworkRequest 在监听到网络请求后做些什么，参数同上
 */
export const observeLongTaskAndResources = (
  onLongTask: (timeInfo: TaskTimeInfo, entry: PerformanceEntry) => void,
  onNetworkRequest: (timeInfo: TaskTimeInfo, resourceEntry: PerformanceResourceTiming) => void,
) => {
  observePerformance({
    entryTypes: [PERFORMANCE_ENTRY_TYPES.LONG_TASK, PERFORMANCE_ENTRY_TYPES.RESOURCE],
  }, (entryList) => {
    for (const entry of entryList) {
      const { startTime, duration, entryType } = entry;

      if (entryType === PERFORMANCE_ENTRY_TYPES.LONG_TASK) {
        onLongTask({
          startTime: startTime,
          endTime: startTime + duration,
        }, entry);
      } else if (entry.entryType === PERFORMANCE_ENTRY_TYPES.RESOURCE) {
        const { fetchStart, responseEnd } = entry as PerformanceResourceTiming;

        onNetworkRequest({
          startTime: fetchStart,
          endTime: responseEnd,
        }, entry as PerformanceResourceTiming);
      }
    }
  });
};
