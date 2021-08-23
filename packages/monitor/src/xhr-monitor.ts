import { formatPlainHeadersString, getPerformance, getUrlData, patchMethod } from './utils';
import { PatchedXMLHttpRequest, XHRMonitorOptions, XHRReportData } from './types/xhr';
import { EventType } from './types/common';

/**
 * 初始化 xhr 监控
 *
 * @author yuzhanglong
 * @date 2021-08-23 21:54:29
 * @param options 监控配置
 */
export function createXhrMonitor(options: XHRMonitorOptions) {
  const XMLHttpRequestPrototype = XMLHttpRequest.prototype;
  const performance = getPerformance();

  const getEntryByName = (name: string) => {
    if (performance && typeof performance.getEntriesByName === 'function') {
      return performance.getEntriesByName(name);
    }
    return [];
  };

  // 生成请求报告
  const getReportData = (patchedXhrInstance: PatchedXMLHttpRequest): XHRReportData => {
    const current = Date.now();
    const responseHeaders = patchedXhrInstance?.getAllResponseHeaders() || '';
    const {
      monitorRecords: {
        url,
        method,
        startTime,
        requestHeaders,
      },
    } = patchedXhrInstance;
    return {
      request: {
        ...getUrlData(url),
        method: method.toUpperCase(),
        headers: requestHeaders,
      },
      response: {
        status: patchedXhrInstance.status || -1,
        timestamp: current,
        headers: responseHeaders ? formatPlainHeadersString(responseHeaders) : {},
      },
      // 如果URL有重定向， responseURL 的值会是经过多次重定向后的最终 URL
      performance: getEntryByName(patchedXhrInstance.responseURL).pop(),
      duration: current - startTime,
    };
  };

  // XMLHttpRequest.prototype.open
  const patchOpen = patchMethod(XMLHttpRequestPrototype, 'open', (open) => {
    return function(this: PatchedXMLHttpRequest, ...openOptions) {
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
      return function(this: PatchedXMLHttpRequest, ...event) {
        if (this.readyState === XMLHttpRequest.DONE) {
          options.onXhrReport({
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
    return function(this: PatchedXMLHttpRequest, ...sendOptions) {
      // 不可以直接修改原型上的 onReadyStateChange
      patchOnReadyStateChange(this)();
      this.monitorRecords = this.monitorRecords || {};

      this.monitorRecords.startTime = new Date().getTime();
      this.monitorRecords.data = send?.[0];
      return send.apply(this, sendOptions);
    };
  });


  const patchSetRequestHeader = patchMethod(XMLHttpRequestPrototype, 'setRequestHeader', (origin) => {
    return function(this: PatchedXMLHttpRequest, ...options: [name: string, value: string]) {
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
