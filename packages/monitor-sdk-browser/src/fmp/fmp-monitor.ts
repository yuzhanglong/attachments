import { EventType } from '../types';
import { FMPMonitorOptions } from './types';
import { isNumber } from 'lodash';
import { useRequestAnimationFrame } from '../utils/use-request-animation-frame';
import { getDomLayoutScore } from '../utils/get-dom-layout-score';

export const createFMPMonitor = (options: FMPMonitorOptions) => {
  if (!MutationObserver) {
    return;
  }
  const reportData = (fmp: number) => {
    if (!isNumber(fmp)) {
      return;
    }

    options.onReport({
      data: {
        fmp: fmp,
      },
      eventType: EventType.FMP,
    });
  };

  const callback = useRequestAnimationFrame(() => {
    const bodyScore = getDomLayoutScore(document.body, 1, true);
    console.log(bodyScore);
  });

  const observer = new MutationObserver(() => {
    callback.runCallback();
  });

  observer.observe(document.body, {
    subtree: true,
    childList: true,
  });
};
