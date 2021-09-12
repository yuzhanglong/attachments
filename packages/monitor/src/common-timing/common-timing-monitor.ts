import { onPageLoad } from '../utils/on-page-load';
import { CommonTimingMonitorOptions } from './types';
import { EventType } from '../types';

export const createCommonTimingMonitor = (options: CommonTimingMonitorOptions) => {
  onPageLoad(() => {
    options.onReport({
      data: {
        timing: performance.timing,
      },
      eventType: EventType.COMMON_PERFORMANCE_TIMING,
    });
  });
};
