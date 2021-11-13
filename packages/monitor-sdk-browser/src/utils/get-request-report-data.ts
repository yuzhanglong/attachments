// 生成请求报告
import { PatchedXMLHttpRequest, XHRReportData } from '../xhr/types';
import { getUrlData } from './get-url-data';
import { formatPlainHeadersString } from './format-plain-headers-string';
import { getPerformanceEntriesByName } from './performance-entry';

export const getRequestReportData = (patchedXhrInstance: PatchedXMLHttpRequest): XHRReportData => {
  const current = Date.now();
  const responseHeaders = patchedXhrInstance?.getAllResponseHeaders() || '';
  const isError = patchedXhrInstance.status >= 400;

  const {
    monitorRecords: { url, method, startTime, requestHeaders, requestData },
  } = patchedXhrInstance;
  return {
    request: {
      ...getUrlData(url),
      method: method.toUpperCase(),
      headers: requestHeaders,
      body: isError ? `${requestData}` : null,
    },
    response: {
      status: patchedXhrInstance.status || -1,
      timestamp: current,
      headers: responseHeaders ? formatPlainHeadersString(responseHeaders) : {},
      body: isError ? `${patchedXhrInstance.response}` : null,
    },
    // 如果URL有重定向， responseURL 的值会是经过多次重定向后的最终 URL
    performance: getPerformanceEntriesByName(patchedXhrInstance.responseURL).pop(),
    duration: current - startTime,
  };
};
