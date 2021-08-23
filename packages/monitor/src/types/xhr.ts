import { UrlData } from '../utils';
import { BaseObject, CallBack } from './common';


// xhr 监控选项
export interface XHRMonitorOptions {
  onXhrReport: CallBack<any>;
}

// xhr 监控结果记录数据
export interface XHRReportData {
  // 请求数据，包括 url 相关参数
  request: UrlData & {
    // 请求方法
    method: string;
    // 通过 setRequestHeaders 添加的请求头
    headers: Record<string, string>;
    body: string
  };
  performance: Record<string, any>;
  duration: number;
  response: {
    status: number;
    timestamp: number;
    headers: Record<string, string>;
    body: string
  };
}


// xhr 监控实例暂存数据记录，挂在在用户初始化的 XMLHttpRequest 上
interface XHRMonitorRecode {
  url?: string;
  method?: string;
  startTime?: number;
  requestHeaders?: BaseObject<string>;
  requestData?: Parameters<XMLHttpRequest['send']>[0];
}


export interface PatchedXMLHttpRequest extends XMLHttpRequest {
  // 记录信息
  monitorRecords: XHRMonitorRecode;
}
