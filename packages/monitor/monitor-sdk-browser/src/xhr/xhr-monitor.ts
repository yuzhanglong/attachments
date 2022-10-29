import { EventType } from '../types';
import { patchMethod } from '../utils/patch-method';
import { getRequestReportData } from '../utils/get-request-report-data';
import { formatPlainHeadersString } from '../utils/format-plain-headers-string';
import type { PatchedXMLHttpRequest, XHRMonitorOptions } from './types';

// XMLHttpRequest.DONE 在低版本 IE 中不兼容
export const XML_HTTP_REQUEST_DONE = XMLHttpRequest.DONE || 4;

/**
 * 初始化 xhr 监控
 *
 * @author yuzhanglong
 * @date 2021-08-23 21:54:29
 * @param options 监控配置
 */
export function createXHRMonitor(options: XHRMonitorOptions) {
  const XMLHttpRequestPrototype = XMLHttpRequest.prototype;

  // XMLHttpRequest.prototype.open，请求的初始化阶段
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
        if (this.readyState === XML_HTTP_REQUEST_DONE) {
          const { url, method, startTime, requestHeaders, requestData } = this.monitorRecords;
          const responseHeaders = this?.getAllResponseHeaders() || '';

          options.onReport({
            eventType: EventType.XHR,
            data: getRequestReportData({
              url,
              method,
              status: this.status,
              requestData,
              requestHeaders,
              responseHeaders: formatPlainHeadersString(responseHeaders),
              startTime,
              responseUrl: this.responseURL,
              responseData: this.response,
            }),
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
