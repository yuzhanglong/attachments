import { JsErrorMonitorOptions } from './types';
import { EventType } from '../types';
import { getBrowserWindow } from '../utils/browser-interfaces';
import { formatError } from '../utils/format-error';

/**
 * javaScript 异常监控能力
 *
 * @author yuzhanglong
 * @date 2021-08-24 17:08:10
 */
export function createJsErrorMonitor(options: JsErrorMonitorOptions) {
  const window = getBrowserWindow();

  if (!window) {
    return;
  }

  const handleError = (e: ErrorEvent) => {
    const data = formatError(e);
    if (data) {
      options.onReport({
        eventType: EventType.JS_ERROR,
        data: data,
      });
    }
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
