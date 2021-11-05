import { EventType } from '../types';
import { FMPMonitorOptions } from './types';
import { isNumber } from 'lodash';
import { onPageLoad } from '../utils/on-page-load';

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

  const probablyFMPDataToReport: {
    layoutSignificant: number;
    fmp: number;
  }[] = [];

  const observer = new MutationObserver((elements) => {
    // 当前回调 DOM 变动的数目
    const changedDOMAmount = elements.length;
    // 当前回调时间
    const current = Date.now();
    // 可视区域高度
    const visibleHeight = window.innerHeight;
    // 文档总高度
    const totalHeight = document.body.scrollHeight;
    const layoutSignificant = changedDOMAmount / Math.max(1, totalHeight / visibleHeight);
    probablyFMPDataToReport.push({
      fmp: current,
      layoutSignificant: layoutSignificant,
    });
    console.log(probablyFMPDataToReport);
  });
  console.log(document.readyState);
  onPageLoad(() => {
    console.log(111);
  });

  observer.observe(document.body, {
    subtree: true,
    childList: true,
  });
};
