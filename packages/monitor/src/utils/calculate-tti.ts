import { last } from 'lodash';
import { getPerformance } from './browser-interfaces';

interface TTICalculateOptions {
  // 起始点
  searchStart: number;
  // 距离最近的，具有至少 2 个网络请求的时间点
  lastKnownNetwork2Busy: number;
  // 检测时间点，该时间位于静默窗口期内
  checkTimeInQuiteWindow: number;
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
  const { searchStart, longTasks, checkTimeInQuiteWindow, lastKnownNetwork2Busy } = options;
  // 确保静默窗口期中没有请求数超过 2 的时刻
  if (checkTimeInQuiteWindow - lastKnownNetwork2Busy < 5000) {
    return null;
  }

  // 如果没有 long task，那么 FCP 时间就是 TTI 时间
  const maybeFCI = longTasks.length === 0 ? searchStart : last(longTasks).endTime;

  // 确保窗口期没有 long task
  if (checkTimeInQuiteWindow - maybeFCI < 5000) {
    return null;
  }

  return Math.max(maybeFCI, getDomContentLoadedEventEndTime());
};
