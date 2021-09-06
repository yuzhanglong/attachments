import { last } from 'lodash';
import { getPerformance } from './browser-interfaces';

interface TTICalculateOptions {
  // 起始点
  searchStart: number;
  // 距离最近的，具有至少 2 个网络请求的时间点
  lastKnownNetwork2Busy: number;
  // 当前时间，该时间位于静默窗口期内
  currentTime: number;
  // 长任务集合
  longTasks: { startTime: number; endTime: number }[];
}


const getDomContentLoadedEventEndTime = () => {
  const { timing } = getPerformance();

  if (timing && timing.domContentLoadedEventEnd) {
    const { domContentLoadedEventEnd, navigationStart } = timing;
    return domContentLoadedEventEnd - navigationStart;
  }

  return null;
};

/**
 * 计算 TTI
 *
 * TTI 算法描述如下：
 * - 从起始点（一般是 FCP 或者 FMP），向前搜索一个不小于 5s 的静默窗口期
 * - 所谓静默窗口期，就是该窗口所对应的时间没有 long task 并且进行中的网络请求数目不超过 2 个
 * - 如果没有找到 long task，则起始点就是 TTI
 * - 如果 TTI < DOMContentLoadedEventEnd, 则以 DOMContentLoadedEventEnd 作为 TTI
 *
 * @author yuzhanglong
 * @date 2021-09-06 15:31:41
 * @param options 见 TTICalculateOptions
 */
export const calculateTTI = (options: TTICalculateOptions) => {
  const { searchStart, longTasks, currentTime, lastKnownNetwork2Busy } = options;
  // 如果当前时间
  if (currentTime - lastKnownNetwork2Busy < 5000) {
    return null;
  }

  const maybeFCI = longTasks.length === 0 ? searchStart : last(longTasks).end;

  if (currentTime - maybeFCI < 5000) {
    return null;
  }

  return Math.max(maybeFCI, getDomContentLoadedEventEndTime());
};
