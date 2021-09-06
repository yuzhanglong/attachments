import { MonitorOptions } from '../types';

export interface TTIReportData {
  tti: number;
}

export type TTIMonitorOptions = MonitorOptions<TTIReportData>
