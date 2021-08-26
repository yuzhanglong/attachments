import { MonitorOptions } from './common';

export type AssetsReportData = {
  timeStamp: number
  performance: Record<string, any>
}

export type AssetsMonitorOptions = MonitorOptions<AssetsReportData>
