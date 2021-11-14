import { MonitorOptions } from '../types';
import { XHRReportData } from '../xhr/types';

type MonitorCommonTimingReportData = XHRReportData;

export type FetchMonitorOptions = MonitorOptions<MonitorCommonTimingReportData>;
