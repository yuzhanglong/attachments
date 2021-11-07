import { EventType } from '../types';
import { FMPMonitorOptions } from './types';
import { useRequestAnimationFrame } from '../utils/use-request-animation-frame';
import { getDomLayoutScore } from '../utils/get-dom-layout-score';
import { getMutationObserver } from '../utils/browser-interfaces';
import { onPageLoad } from '../utils/on-page-load';

interface FMPRecodeData {
  time: number;
  domScore: number;
}

export const calculateFMP = (scoredData: FMPRecodeData[]) => {
  // 首先将打分结果基于时间排序(时间戳从小到大)
  scoredData.sort((a, b) => a.time - b.time);

  // 计算每两个时间戳之间的得分差值，变动最大的即为最终结果
  const initInfoValue = {
    maxDelta: -1,
    time: -1,
    prev: {
      time: 0,
      domScore: 0,
    } as FMPRecodeData,
  };

  const res = scoredData.reduce((info, curr) => {
    const delta = curr.domScore - info.prev.domScore;
    if (delta > info.maxDelta) {
      info.maxDelta = delta;
      info.time = curr.time;
    }
    info.prev = curr;
    return info;
  }, initInfoValue);

  return res;
};

export const createFMPMonitor = (options: FMPMonitorOptions) => {
  const MutationObserver = getMutationObserver();

  if (!MutationObserver) {
    return;
  }

  const startTime = Date.now();

  const scoredData: FMPRecodeData[] = [];

  const observeFMP = () => {
    const callback = useRequestAnimationFrame(() => {
      const bodyScore = getDomLayoutScore(document.body, 1, true);
      scoredData.push({
        domScore: bodyScore,
        time: Date.now() - startTime,
      });
    });

    const observer = new MutationObserver(() => {
      callback.runCallback();
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });

    return observer;
  };

  const observer = observeFMP();

  const reportData = () => {
    options.onReport({
      data: {
        fmp: calculateFMP(scoredData).time,
      },
      eventType: EventType.FMP,
    });
    observer.disconnect();
  };

  // FMP 和 onload 事件并不密切相关，但它很可能在 onload 事件附近，所以我们延时一小段时间再报告
  onPageLoad(() => {
    setTimeout(() => {
      reportData();
    }, 1000);
  });
};
