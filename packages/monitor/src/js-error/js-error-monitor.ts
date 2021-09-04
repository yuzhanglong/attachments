/**
 * File: js-error-monitor.ts
 * Description: javascript 错误监控
 * Created: 2021-08-24 17:08:10
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { JsErrorMonitorOptions } from './types';
import { EventType } from '../types';
import { getBrowserWindow } from '../utils/browser-interfaces';
import { formatError } from '../utils/format-error';

export function createJsErrorMonitor(options: JsErrorMonitorOptions) {
  const window = getBrowserWindow();
  if (!window) {
    return;
  }

  const handleError = (e: ErrorEvent) => {
    options.onReport({
      eventType: EventType.JS_ERROR,
      data: formatError(e),
    });
  };

  const handleRejection = (e: PromiseRejectionEvent) => {
    options.onReport({
      eventType: EventType.JS_ERROR,
      data: formatError(e),
    });
  };

  const destroyListeners = () => {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleRejection);
  };

  // 捕获异步 error
  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleRejection);

  return {
    destroy: destroyListeners,
  };
}
