/**
 * 初始化 fetch 监听器
 *
 * @author yuzhanglong
 * @date 2021-11-14 12:08:25
 */
import { patchMethod } from '../utils/patch-method';
import { getBrowserWindow } from '../utils/browser-interfaces';
import { FetchMonitorOptions } from './types';

export const createFetchMonitor = (options: FetchMonitorOptions) => {
  const browserWindow = getBrowserWindow();
  if (!browserWindow) {
    return;
  }

  patchMethod(browserWindow, 'fetch', (origin: typeof window['fetch']) => {
    return async (req, options) => {
      const fetchPromise = origin(req, options);

      console.log(req);
      console.log(options);

      return fetchPromise;
    };
  })();
};
