import { MonitorOptions } from '../types';

export interface LayoutShift {
  duration: number;
  entryType: 'layout-shift';
  hadRecentInput: boolean;
  lastInputTime: number;
  startTime: number;
  value: number;
  name: string;
}


interface ClsReportData {
  clsValue: number;
}

export type ClsMonitorOptions = MonitorOptions<ClsReportData>
