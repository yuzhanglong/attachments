import { MonitorOptions } from '../types';

export interface FIDEntry extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
}

interface FIDReportData {
  fid: FIDEntry;
}

export type FIDMonitorOptions = MonitorOptions<FIDReportData>
