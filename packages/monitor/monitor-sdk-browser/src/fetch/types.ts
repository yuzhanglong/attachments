import { MonitorOptions } from '../types';
import { XHRReportData } from '../xhr/types';

export type FetchReportData = XHRReportData;

export type FetchMonitorOptions = MonitorOptions<FetchReportData>;
