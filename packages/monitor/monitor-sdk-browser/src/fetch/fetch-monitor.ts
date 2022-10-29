/**
 * 初始化 fetch 监听器
 *
 * @author yuzhanglong
 * @date 2021-11-14 12:08:25
 */
import { isString } from 'lodash';
import { patchMethod } from '../utils/patch-method';
import { getBrowserWindow } from '../utils/browser-interfaces';
import { EventType } from '../types';
import { getRequestReportData } from '../utils/get-request-report-data';
import type { FetchMonitorOptions } from './types';

export const createFetchMonitor = (options: FetchMonitorOptions) => {
  const browserWindow = getBrowserWindow();
  if (!browserWindow)
    return;

  // 获取 fetch 入参的 url 字符串
  const parseFetchUrl = (requestInfo: RequestInfo) => {
    if (isString(requestInfo))
      return requestInfo;

    return requestInfo.url;
  };

  patchMethod(browserWindow, 'fetch', (origin: typeof window['fetch']) => {
    return async (requestInfo, requestInit) => {
      // 先让浏览器开启线程去执行网络请求，提高性能
      const fetchPromise = origin(requestInfo, requestInit);

      // 即将被上报的数据
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
          // 只有 4xx 以上的错误才会收集响应体
          let data = '';
          if (res.status >= 400)
            data = await res.clone().text();

          initData.responseUrl = res.url;
          initData.responseHeaders = res.headers;
          initData.status = res.status || -1;
          initData.responseData = data;
          reportData();
        }
        catch (e) {
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
