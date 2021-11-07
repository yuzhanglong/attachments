/**
 * 使用 request animation frame 调度某个回调函数
 *
 * @author yuzhanglong
 * @date 2021-11-06 23:18:15
 */
import { getAnimationFrame } from './browser-interfaces';
import { isFunction } from 'lodash';

export const useRequestAnimationFrame = (callback: FrameRequestCallback) => {
  const { raf, caf } = getAnimationFrame();

  if (!isFunction(raf) || !isFunction(caf)) {
    return;
  }

  // raf 的返回值为非 0 数字
  let rafTimer: number = 0;

  const runCallback = () => {
    if (rafTimer) {
      // requestAnimationFrame 不管理回调函数
      // 在回调被执行前，多次调用带有同一回调函数的 requestAnimationFrame，会导致回调在同一帧中执行多次
      // 常见的情况是一些事件机制导致多次触发
      // 设定一个 timer，如果接下来回调再次被调度，那么撤销上一个
      // https://www.w3.org/TR/animation-timing/#dom-windowanimationtiming-requestanimationframe
      caf(rafTimer);
    } else {
      rafTimer = raf(callback);
    }
  };

  const cancelCallback = () => {
    if (rafTimer) {
      caf(rafTimer);
    }
  };

  return {
    runCallback,
    cancelCallback,
  };
};
