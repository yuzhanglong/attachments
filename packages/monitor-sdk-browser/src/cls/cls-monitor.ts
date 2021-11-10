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
import { observePerformance } from '../utils/observe-performance';
import { onPageUnload } from '../utils/on-page-unload';

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
  let entries: LayoutShift[] = [];

  const destroy = observePerformance(observerOptions, (entryList: LayoutShift[]) => {
    for (let entry of entryList) {
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
        clsValue: clsValue,
        entries: entries,
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
    destroy: destroy,
    getReportData: getReportData,
  };
}
