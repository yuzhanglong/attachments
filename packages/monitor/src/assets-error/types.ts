import { MonitorOptions, UrlData } from '../types';

export type AssetsErrorReportData =  {
  tagName: string,
  timestamp: number,
  performance: Record<string, any>,
} & UrlData

export type AssetsErrorMonitorOptions = MonitorOptions<AssetsErrorReportData>
