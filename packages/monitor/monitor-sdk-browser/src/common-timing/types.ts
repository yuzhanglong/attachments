import type { MonitorOptions } from '../types';

interface CommonTimingReportData {
  timing: PerformanceTiming
}

export type CommonTimingMonitorOptions = MonitorOptions<CommonTimingReportData>;
