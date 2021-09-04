/**
 * File: cls-monitor.ts
 * Description: 累积布局偏移监控
 * Created: 2021-08-27 23:17:43
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */
import { PERFORMANCE_ENTRY_TYPES } from '../constants';
import { ClsMonitorOptions, LayoutShift } from './types';
import { EventType } from '../types';
import { getFirstAndLast } from '../utils/get-first-and-last';
import { observePerformance } from '../utils/observe-performance';


// 每个 layout shift 间隔的最大值
export const LAYOUT_SHIFT_GAP = 1000;

// 一次 layout session 的间隔
export const LAYOUT_SHIFT_SESSION_MAX_SIZE = 5000;

export function createClsMonitor(clsMonitorOptions: ClsMonitorOptions) {
  // CLS 是衡量页面整个生命周期内发生的每个意外布局偏移的最大布局偏移分数的度量
  // 可以参考：
  // https://web.dev/cls/#what-is-cls
  // https://github.com/GoogleChrome/web-vitals/blob/main/src/getCLS.ts
  const observerOptions: PerformanceObserverInit = {
    type: PERFORMANCE_ENTRY_TYPES.LAYOUT_SHIFT,
  };

  let clsValue = 0;
  let sessionValue = 0;
  let sessionEntries: LayoutShift[] = [];

  const destroy = observePerformance(observerOptions, (entryList) => {
    const len = entryList.length;
    for (let i = 0; i < len; i += 1) {
      const entry = entryList[i] as unknown as LayoutShift;

      // 只计算没有最近用户输入的布局变化
      if (!entry.hadRecentInput) {
        const [firstSessionEntry, lastSessionEntry] = getFirstAndLast<LayoutShift>(sessionEntries);

        // session: 某一小段时间的变化
        // 距离上一次 layoutShift 不到 1s, 距离本次 session 的开始时 layoutShift 不到 5s，参考 Chrome 的开源库：
        // https://github.com/GoogleChrome/web-vitals/blob/main/src/getCLS.ts
        if (sessionValue &&
          entry.startTime - lastSessionEntry.startTime < LAYOUT_SHIFT_GAP &&
          entry.startTime - firstSessionEntry.startTime < LAYOUT_SHIFT_SESSION_MAX_SIZE) {
          sessionValue += entry.value;
          sessionEntries.push(entry);
        } else {
          sessionValue = entry.value;
          sessionEntries = [entry];
        }

        // 如果当前会话值大于当前 CLS 值，更新 CLS
        if (sessionValue > clsValue) {
          clsValue = sessionValue;

          clsMonitorOptions.onReport({
            data: {
              clsValue: clsValue,
            },
            eventType: EventType.CUMULATIVE_LAYOUT_SHIFT,
          });
        }
      }
    }

  });


  return {
    destroy: destroy,
  };
}
