/**
 * File: cls-monitor.ts
 * Description: 累积布局偏移监控
 * Created: 2021-08-27 23:17:43
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */
import { observePerformance } from '../utils';
import { PERFORMANCE_ENTRY_TYPES } from '../constants';

export function createClsMonitor() {
  // CLS 是衡量页面整个生命周期内发生的每个意外布局偏移的最大布局偏移分数的度量
  // 可以参考：
  // https://web.dev/cls/#what-is-cls
  // https://github.com/GoogleChrome/web-vitals/blob/main/src/getCLS.ts
  const observerOptions: PerformanceObserverInit = {
    type: PERFORMANCE_ENTRY_TYPES.LAYOUT_SHIFT,
  };

  const destroy = observePerformance(observerOptions, (entryList) => {
    console.log(entryList);
  });


  return {
    destroy: destroy,
  };
}
