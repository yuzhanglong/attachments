import { MonitorOptions } from '../types';

export interface TTIReportData {
  tti: number;
}

export type TTIMonitorOptions = MonitorOptions<TTIReportData>

export interface PatchedXMLHttpRequest extends XMLHttpRequest{
  taggedMethod: string;
}
