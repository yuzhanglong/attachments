import { MonitorOptions } from './common';

export interface JsErrorReportData {
  timeStamp: number;
  error: {
    name: string;
    message: string;
    stack: string;
  };
}

export type JsErrorMonitorOptions = MonitorOptions<JsErrorReportData>
