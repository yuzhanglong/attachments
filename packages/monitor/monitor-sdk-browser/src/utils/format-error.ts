import type { JsErrorReportData } from '../js-error/types';
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
  }
  else if (instanceOf(e, ErrorEvent)) {
    error = (e as ErrorEvent).error;
  }
  else {
    // @ts-expect-error
    error = e.reason || e.error;
  }

  if (!error) {
    // 这是为了处理跨域脚本内部异常详细信息无法获取的边界情况
    // 此类错误我们忽略之
    return;
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
