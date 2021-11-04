import { EventType } from '../types';
import { FMPMonitorOptions } from './types';
import { isNumber } from 'lodash';

export const createFMPMonitor = (options: FMPMonitorOptions) => {
  const reportData = (fmp: number) => {
    if (!isNumber(fmp)) {
      return;
    }
    options.onReport({
      data: {
        fmp: fmp,
      },
      eventType: EventType.FID,
    });
  };
};
