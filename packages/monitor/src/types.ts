// 推断某个对象的所有 Functional keys
export type MethodKeys<O extends {}> = {
  [key in keyof O]: O[key] extends Function ? key : never
}[keyof O]

// 推断某个对象所有非 Functional key
export type CommonKeys<O extends {}> = {
  [key in keyof O]: O[key] extends Function ? never : key
}[keyof O]


// 回调
export type CallBack<P> = (params: P) => void

export type BaseObject<T = any> = Record<string, T>

export enum EventType {
  // noinspection SpellCheckingInspection
  XHR = 'XHR',
  JS_ERROR = 'JS_ERROR',
  ASSETS = 'ASSETS',
  ASSETS_ERROR = 'ASSETS_ERROR',
  PAINT = 'PAINT',
  LARGEST_CONTENTFUL_PAINT = 'LARGEST_CONTENTFUL_PAINT',
  CUMULATIVE_LAYOUT_SHIFT = 'CUMULATIVE_LAYOUT_SHIFT',
  TTI = 'TTI',
  MPFID = 'MPFID',
  FID = 'FID',
  COMMON_PERFORMANCE_TIMING = 'COMMON_PERFORMANCE_TIMING'
}

export interface MonitorOptions<Report> {
  // 发送报告回调
  onReport: CallBack<{
    // 上报事件的类型
    eventType: EventType
    data: Report
  }>;
}

export interface UrlData {
  url: string,
  hash: string,
  host: string,
  hostname: string,
  href: string,
  origin: string,
  pathname: string,
  port: string,
  protocol: string,
  search: string,
}
