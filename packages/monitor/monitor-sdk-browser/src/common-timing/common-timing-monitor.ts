import { onPageLoad } from '../utils/on-page-load';
import { EventType } from '../types';
import type { CommonTimingMonitorOptions } from './types';

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
