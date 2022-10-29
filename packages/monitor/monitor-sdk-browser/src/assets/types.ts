import type { MonitorOptions } from '../types';

export interface AssetsReportData {
  timeStamp: number
  performance: Record<string, any>
}

export type AssetsMonitorOptions = MonitorOptions<AssetsReportData>;
