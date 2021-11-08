import { MonitorOptions } from '../types';

interface FMPReportData {
  fmp: number;
}

export type FMPMonitorOptions = MonitorOptions<FMPReportData> & {
  exact?: boolean;
};
