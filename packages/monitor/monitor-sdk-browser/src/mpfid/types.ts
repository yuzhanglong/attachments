import type { MonitorOptions } from '../types';

export interface MPFIDReportData {
  // noinspection SpellCheckingInspection
  mpfid: number
}

export type MPFIDMonitorOptions = MonitorOptions<MPFIDReportData> & {
  // 在 onload 事件之后多久结束监听，默认为200ms，一般不需要改，增加这个 option 的重要目的是方便单测
  timeout?: number
};
