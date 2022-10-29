// 生成请求报告
import type { XHRReportData } from '../xhr/types';
import { PatchedXMLHttpRequest } from '../xhr/types';
import { getUrlData } from './get-url-data';
import { formatPlainHeadersString } from './format-plain-headers-string';
import { getPerformanceEntriesByName } from './performance-entry';

export interface GetRequestReportDataOptions {
  url: string
  method: string
  status: number
  startTime: number
  requestHeaders: Record<string, string>
  responseHeaders: Record<string, string>
  requestData: any
  responseData: any
  responseUrl: string
}

/**
 * 格式化请求上报数据
 *
 * @author yuzhanglong
 * @date 2021-11-14 15:03:53
 */
export const getRequestReportData = (options: GetRequestReportDataOptions): XHRReportData => {
  const { url, method, status, startTime, requestHeaders, responseUrl, responseHeaders, responseData, requestData }
    = options;
  const current = Date.now();
  const isError = status >= 400;

  return {
    request: {
      ...getUrlData(url),
      method: method.toUpperCase(),
      headers: requestHeaders,
      body: isError ? `${requestData}` : null,
    },
    response: {
      status: status || -1,
      timestamp: current,
      headers: responseHeaders,
      body: isError ? `${responseData}` : null,
    },
    // 如果URL有重定向， responseURL 的值会是经过多次重定向后的最终 URL
    performance: getPerformanceEntriesByName(responseUrl).pop(),
    duration: current - startTime,
  };
};
