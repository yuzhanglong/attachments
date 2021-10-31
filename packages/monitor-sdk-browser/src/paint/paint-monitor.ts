import { PERFORMANCE_ENTRY_TYPES } from '../constants';
import { LargestContentfulPaint, PaintMonitorOptions } from './types';
import { EventType } from '../types';
import { noop } from '../utils/noop';
import { getPerformance } from '../utils/browser-interfaces';
import { observePerformance } from '../utils/observe-performance';
import { isFunction } from 'lodash';

const FIRST_PAINT = 'first-paint';
const FIRST_CONTENTFUL_PAINT = 'first-contentful-paint';

export function createPaintMonitor(options: PaintMonitorOptions) {
  const performance = getPerformance();

  if (!performance) {
    return;
  }

  // 销毁回调合集
  const destroyCallback = [];

  const getDataFromPaintPreferenceArray = (entries: PerformanceEntry[]) => {
    // 无法确定由于浏览器的差异造成的可能的先后顺序问题，我们使用 filter name 来拿到相关指标
    const [firstPaintEntry] = entries.filter((entry) => entry.name === FIRST_PAINT);
    const [firstContentfulPaintEntry] = entries.filter((entry) => entry.name === FIRST_CONTENTFUL_PAINT);
    return [firstPaintEntry, firstContentfulPaintEntry];
  };

  const doReport = (fp: Record<string, any>, fcp: Record<string, any>, type: EventType) => {
    options.onReport({
      data: {
        timeStamp: Date.now(),
        firstPaint: fp,
        firstContentfulPaint: fcp,
      },
      eventType: type,
    });
  };

  // 尝试监听器上报 FP && FCP
  const reportFirstPaintAndFirstContentfulPaintByObserver = () => {
    // 先尝试主动上报 FP && FCP
    const entries = performance.getEntriesByType(PERFORMANCE_ENTRY_TYPES.PAINT);
    const [firstPaintEntry, firstContentfulPaintEntry] = getDataFromPaintPreferenceArray(entries);

    if (firstPaintEntry && firstContentfulPaintEntry) {
      doReport(firstPaintEntry, firstContentfulPaintEntry, EventType.PAINT);
      return;
    }

    // 如果主动获取失败（脚本执行，但还没绘制完成），再添加监听器
    const observerOptions: PerformanceObserverInit = {
      entryTypes: [PERFORMANCE_ENTRY_TYPES.PAINT],
    };

    const destroy = observePerformance(
      observerOptions,
      (entryList) => {
        const [firstPaintEntry, firstContentfulPaintEntry] = getDataFromPaintPreferenceArray(entryList);
        if (firstPaintEntry && firstContentfulPaintEntry) {
          doReport(firstPaintEntry, firstContentfulPaintEntry, EventType.PAINT);
          destroy();
        }
      },
      false
    );

    destroyCallback.push(destroy);
  };

  // 监听最大内容绘制时间
  const reportLargestContentfulPaintByObserver = () => {
    const observerOptions: PerformanceObserverInit = {
      entryTypes: [PERFORMANCE_ENTRY_TYPES.LARGEST_CONTENTFUL_PAINT],
    };

    const destroy = observePerformance(observerOptions, (entryList) => {
      entryList.forEach((entry) => {
        options.onReport({
          data: {
            timeStamp: Date.now(),
            largestContentfulPaint: entry as unknown as LargestContentfulPaint,
          },
          eventType: EventType.LARGEST_CONTENTFUL_PAINT,
        });
      });
    });

    destroyCallback.push(destroy);
  };

  reportFirstPaintAndFirstContentfulPaintByObserver();
  reportLargestContentfulPaintByObserver();

  return {
    destroy: () => {
      destroyCallback.forEach((fn) => (isFunction(fn) ? fn() : noop()));
    },
  };
}
