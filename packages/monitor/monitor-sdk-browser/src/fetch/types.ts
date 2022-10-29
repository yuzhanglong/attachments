import type { MonitorOptions } from '../types';
import type { XHRReportData } from '../xhr/types';

export type FetchReportData = XHRReportData;

export type FetchMonitorOptions = MonitorOptions<FetchReportData>;
