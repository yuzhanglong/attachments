import { JsErrorReportData } from '../js-error/types';
import { instanceOf } from './instance-of';

/**
 * 格式化错误信息，将其转换为简单对象
 *
 * @author yuzhanglong
 * @date 2021-08-24 22:59:27
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error
 * @param e 异常 ErrorEvent, 或者 PromiseRejectionEvent 实例
 * 前者来自 window.addEventListener('error') 的回调
 * 后者来自 window.addEventListener('unhandledrejection') 的回调
 */
export function formatError(e: ErrorEvent | PromiseRejectionEvent): JsErrorReportData {
  let error: Error;

  if (instanceOf(e, PromiseRejectionEvent)) {
    error = (e as PromiseRejectionEvent).reason;
  } else if (instanceOf(e, ErrorEvent)) {
    error = (e as ErrorEvent).error;
  } else {
    // @ts-ignore
    error = e.reason || e.error || {};
  }


  return {
    // 发生异常的时间戳
    timestamp: Date.now(),
    // 核心内容，包括堆栈错误信息
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  };
}
