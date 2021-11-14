/**
 * 初始化 fetch 监听器
 *
 * @author yuzhanglong
 * @date 2021-11-14 12:08:25
 */
import { patchMethod } from '../utils/patch-method';
import { getBrowserWindow } from '../utils/browser-interfaces';
import { FetchMonitorOptions } from './types';
import { EventType } from '../types';
import { getRequestReportData } from '../utils/get-request-report-data';
import { isString } from 'lodash';

export const createFetchMonitor = (options: FetchMonitorOptions) => {
  const browserWindow = getBrowserWindow();
  if (!browserWindow) {
    return;
  }

  // 获取 fetch 入参的 url 字符串
  const parseFetchUrl = (requestInfo: RequestInfo) => {
    if (isString(requestInfo)) {
      return requestInfo;
    }

    return requestInfo.url;
  };

  patchMethod(browserWindow, 'fetch', (origin: typeof window['fetch']) => {
    return async (requestInfo, requestInit) => {
      // 提高性能，尽早开始请求
      const fetchPromise = origin(requestInfo, requestInit);

      const initData = {
        // REQUEST OPTIONS
        url: parseFetchUrl(requestInfo),
        method: requestInit?.method || 'GET',
        requestData: requestInit?.body,
        requestHeaders: requestInit?.headers as Record<string, string>,
        startTime: Date.now(),

        // RESPONSE OPTIONS
        responseData: undefined,
        responseHeaders: undefined,
        responseUrl: '',
        status: -1,
      };

      const reportData = () => {
        // fetch 的 Performance API 收集存在一定延迟，这里需要延迟一秒再上报
        setTimeout(() => {
          options.onReport({
            eventType: EventType.FETCH,
            data: getRequestReportData(initData),
          });
        }, 1000);
      };

      const onResolve = async (res: Response) => {
        try {
          const data = await res.clone().text();
          initData.responseUrl = res.url;
          initData.responseHeaders = res.headers;
          initData.status = res.status || -1;
          initData.responseData = data;
          reportData();
        } catch (e) {
          console.error(e);
        }
      };

      const onReject = () => {
        reportData();
      };

      fetchPromise.then(onResolve, onReject);

      return fetchPromise;
    };
  })();
};
