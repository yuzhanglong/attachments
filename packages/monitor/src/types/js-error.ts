import { MonitorOptions } from './common';

export interface JsErrorReportData {
  timestamp: number;
  error: {
    name: string;
    message: string;
    stack: string;
  };
}

export type JsErrorMonitorOptions = MonitorOptions<JsErrorReportData>
