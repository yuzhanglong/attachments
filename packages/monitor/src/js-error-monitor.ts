/**
 * File: js-error-monitor.ts
 * Description: javascript 错误监控
 * Created: 2021-08-24 17:08:10
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { JsErrorMonitorOptions } from './types/js-error';
import { formatError, getBrowserWindow } from './utils';
import { EventType } from './types/common';

export function createJsErrorMonitor(options: JsErrorMonitorOptions) {
  const window = getBrowserWindow();
  if (!window) {
    return;
  }

  window.addEventListener('error', (e) => {
    options.onReport({
      eventType: EventType.JS_ERROR,
      data: formatError(e),
    });
  });

  window.addEventListener('unhandledrejection', (e) => {
    options.onReport({
      eventType: EventType.JS_ERROR,
      data: formatError(e),
    });
  });
}
