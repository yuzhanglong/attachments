import { MonitorOptions } from '../types';

export interface MPFIDReportData {
  // noinspection SpellCheckingInspection
  mpfid: number;
}

export type MPFIDMonitorOptions = MonitorOptions<MPFIDReportData>;
