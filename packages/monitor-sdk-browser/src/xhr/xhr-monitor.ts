import { PatchedXMLHttpRequest, XHRMonitorOptions, XHRReportData } from './types';
import { EventType } from '../types';
import { patchMethod } from '../utils/patch-method';
import { formatPlainHeadersString } from '../utils/format-plain-headers-string';
import { getUrlData } from '../utils/get-url-data';
import { getPerformanceEntriesByName } from '../utils/performance-entry';

/**
 * 初始化 xhr 监控
 *
 * @author yuzhanglong
 * @date 2021-08-23 21:54:29
 * @param options 监控配置
 */
export function createXhrMonitor(options: XHRMonitorOptions) {
  const XMLHttpRequestPrototype = XMLHttpRequest.prototype;

  // 生成请求报告
  const getReportData = (patchedXhrInstance: PatchedXMLHttpRequest): XHRReportData => {
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

  // XMLHttpRequest.prototype.open
  const patchOpen = patchMethod(XMLHttpRequestPrototype, 'open', (open) => {
    return function (this: PatchedXMLHttpRequest, ...openOptions) {
      const [method, url] = openOptions;

      this.monitorRecords = this.monitorRecords || {};

      this.monitorRecords.url = url;
      this.monitorRecords.method = method;

      return open.apply(this, openOptions);
    };
  });

  // XMLHttpRequest.prototype.onReadyStateChange
  const patchOnReadyStateChange = (target: PatchedXMLHttpRequest) => {
    return patchMethod(target, 'onreadystatechange', (origin) => {
      return function (this: PatchedXMLHttpRequest, ...event) {
        if (this.readyState === XMLHttpRequest.DONE) {
          options.onReport({
            eventType: EventType.XHR,
            data: getReportData(this),
          });
        }
        return origin && origin.apply(this, event);
      };
    });
  };

  // XMLHttpRequest.prototype.send
  const patchSend = patchMethod(XMLHttpRequestPrototype, 'send', (send) => {
    return function (this: PatchedXMLHttpRequest, ...sendOptions) {
      // 不可以直接修改原型上的 onReadyStateChange
      patchOnReadyStateChange(this)();
      this.monitorRecords = this.monitorRecords || {};

      this.monitorRecords.startTime = new Date().getTime();
      this.monitorRecords.requestData = send?.[0];
      return send.apply(this, sendOptions);
    };
  });

  const patchSetRequestHeader = patchMethod(XMLHttpRequestPrototype, 'setRequestHeader', (origin) => {
    return function (this: PatchedXMLHttpRequest, ...options: [name: string, value: string]) {
      const [name, value] = options;

      this.monitorRecords = this.monitorRecords || {};
      this.monitorRecords.requestHeaders = this.monitorRecords.requestHeaders || {};

      this.monitorRecords.requestHeaders[name.toLowerCase()] = value;
      return origin.apply(this, options);
    };
  });

  // patch 需要覆盖的 methods
  patchOpen();
  patchSend();
  patchSetRequestHeader();
}