import { MonitorOptions } from '../types';

export interface JsErrorReportData {
  timestamp: number;
  error: {
    name: string;
    message: string;
    stack: string;
  };
}

export type JsErrorMonitorOptions = MonitorOptions<JsErrorReportData>;
