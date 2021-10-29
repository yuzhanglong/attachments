import { noop } from './noop';
import { getPerformanceObserver } from './browser-interfaces';

/**
 * 监听 performance 性能指标， 当不支持 performance API 时，我们不进行任何动作
 *
 * @author yuzhanglong
 * @date 2021-08-26 16:38:12
 * @param options 监听的选项，可以在这里配置监听目标
 * @param callback 监听回调
 * @param once 仅监听一次
 * @return Function 一个销毁监听器的函数，如果 performance API 不存在，则返回 noop
 *
 */
export const observePerformance = (
  options: PerformanceObserverInit,
  callback: (entryList: PerformanceEntry[]) => void,
  once: boolean = false
) => {
  let destroy = noop;

  let isExecuted = false;

  // 通过 observer 监听
  const PerformanceObserver = getPerformanceObserver();
  if (PerformanceObserver) {
    const observerInstance = new PerformanceObserver((list) => {
      // 用户配置了只回调一次，并且已经执行过，我们不再执行
      if (once && isExecuted) {
        return;
      }
      // performanceEntries 是【某小一段时间】得到的性能结果
      // 我们再遍历他们，并逐一调用 callback, 这样上层调用者无需再额外处理
      const performanceEntries = list.getEntries();
      callback(performanceEntries);
      isExecuted = true;
    });

    observerInstance.observe(options);

    // 覆写销毁函数
    destroy = () => {
      observerInstance.disconnect();
    };
  }

  return destroy;
};
