import { CallBack, ReportBase } from '../../src/types';
import { noop } from 'lodash';

interface PromisifyMonitorReportOptions<T> {
  monitorFactory: CallBack<any>;
  afterCreateMonitorCallback?: CallBack<any>;
  reportTimesBeforeResolve?: number;
}

export const promisifyMonitorReport = <MonitorReportData>(
  options: PromisifyMonitorReportOptions<MonitorReportData>
) => {
  const { monitorFactory, afterCreateMonitorCallback = noop, reportTimesBeforeResolve = 1 } = options;
  return new Promise<ReportBase<MonitorReportData>[]>((resolve) => {
    const reportData = [];
    monitorFactory({
      onReport: (e) => {
        reportData.push(e);
        if (reportData.length >= reportTimesBeforeResolve) {
          resolve(reportData);
        }
      },
    });
    afterCreateMonitorCallback();
  });
};
