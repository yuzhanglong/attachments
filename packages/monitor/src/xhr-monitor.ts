// eslint-disable-next-line max-classes-per-file
import { getPerformance, getUrlData, patchMethod } from './utils';
import { BaseObject, CallBack } from './types';
import { EventType } from './common';

interface XHRMonitorRecode {
  url?: string;
  method?: string;
  startTime?: number;
  requestHeaders?: BaseObject<string>;
  data?: Parameters<XMLHttpRequest['send']>[0];
}

interface PatchedXMLHttpRequest extends XMLHttpRequest {
  // 记录信息
  monitorRecords: XHRMonitorRecode;
}

interface XhrMonitorOptions {
  reportCallBack: CallBack<any>;
}

interface XhrReportData {
  request: {};
}

export function createXhrMonitor(options: XhrMonitorOptions) {
  const XMLHttpRequestPrototype = XMLHttpRequest.prototype;
  const performance = getPerformance();

  const getEntryByName = (name: string) => {
    if (performance) {
      return performance?.getEntriesByName(name);
    }
    return null;
  };


  // 生成请求报告
  const getReportData = (patchedXhrInstance: PatchedXMLHttpRequest) => {
    const { monitorRecords } = patchedXhrInstance;
    return {
      request: {
        ...getUrlData(monitorRecords.url),
        method: monitorRecords.method.toUpperCase(),
        headers: monitorRecords,
      },
    };
  };

  // XMLHttpRequest.prototype.open
  const patchOpen = patchMethod(XMLHttpRequestPrototype, 'open', (open) => {
    return function(this: PatchedXMLHttpRequest, ...openOptions) {
      const [method, url] = openOptions;

      if (!this.monitorRecords) {
        this.monitorRecords = {};
      }

      this.monitorRecords.url = url;
      this.monitorRecords.url = method;

      return open.apply(this, openOptions);
    };
  });

  // XMLHttpRequest.prototype.send
  const patchSend = patchMethod(XMLHttpRequestPrototype, 'send', (send) => {
    return function(this: PatchedXMLHttpRequest, ...sendOptions) {
      if (!this.monitorRecords) {
        this.monitorRecords = {};
      }

      this.monitorRecords.startTime = new Date().getTime();
      this.monitorRecords.data = send?.[0];
      return send.apply(this, sendOptions);
    };
  });

  // XMLHttpRequest.prototype.onReadyStateChange
  const patchOnReadyStateChange = patchMethod(XMLHttpRequestPrototype, 'onreadystatechange', (origin) => {
    return function(this: PatchedXMLHttpRequest) {
      if (this.readyState === XMLHttpRequest.DONE) {
        options.reportCallBack({
          eventType: EventType.XHR,
          data: getReportData(this),
        });
      }
    };
  });


  patchOpen();
  patchSend();
}
