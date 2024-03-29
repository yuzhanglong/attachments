import { PERFORMANCE_ENTRY_TYPES } from '../constants';
import { EventType } from '../types';
import { observePerformance } from '../utils/observe-performance';
import { onPageUnload } from '../utils/on-page-unload';
import type { ClsMonitorOptions, LayoutShift } from './types';

/**
 * 累计布局偏移监控
 *
 * @author yuzhanglong
 * @date 2021-08-27 23:17:43
 * @param clsMonitorOptions 相关选项
 */
export function createClsMonitor(clsMonitorOptions: ClsMonitorOptions) {
  // CLS 是衡量偏移频率的一个指标，它代表整个页面生命周期内发生的所有意外布局偏移中最大连续布局偏移分数。
  // 可以参考：
  // https://web.dev/cls/#what-is-cls
  // https://github.com/mmocny/web-vitals/blob/master/src/getCLS.ts
  // https://wicg.github.io/layout-instability/#sec-layout-shift
  const observerOptions: PerformanceObserverInit = {
    type: PERFORMANCE_ENTRY_TYPES.LAYOUT_SHIFT,
  };

  let clsValue = 0;
  const entries: LayoutShift[] = [];

  const destroy = observePerformance(observerOptions, (entryList: LayoutShift[]) => {
    for (const entry of entryList) {
      // 在用户输入 500 毫秒内发生的布局偏移会带有 hadRecentInput 标志，便于在计算中排除这些偏移。
      // 适用于不连续输入事件，如轻触、点击或按键操作。滚动、拖动或捏拉缩放手势等连续性交互操作不算作"最近输入"
      // 相关介绍：https://wicg.github.io/layout-instability/#dom-layoutshift-hadrecentinput
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        entries.push(entry);
      }
    }
  });

  const getReportData = () => {
    return {
      data: {
        clsValue,
        entries,
      },
      eventType: EventType.CUMULATIVE_LAYOUT_SHIFT,
    };
  };

  const reportData = () => {
    clsMonitorOptions.onReport(getReportData());
  };

  onPageUnload(() => {
    reportData();
  });

  return {
    destroy,
    getReportData,
  };
}
