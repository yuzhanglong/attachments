import { MonitorOptions } from '../types';

interface FMPReportData {
  fmp: number;
}

export type FMPMonitorOptions = MonitorOptions<FMPReportData> & {
  algorithm: 'dom-score' | 'layout-significant';
};
