import { MonitorOptions } from '../types';

export type AssetsReportData = {
  timeStamp: number;
  performance: Record<string, any>;
};

export type AssetsMonitorOptions = MonitorOptions<AssetsReportData>;
