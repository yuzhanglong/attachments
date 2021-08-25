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
  XHR = 'XHR',
  JS_ERROR = 'JS_ERROR',
  ASSETS_ERROR = 'ASSETS_ERROR'
}

export interface MonitorOptions<Report> {
  // 发送报告回调
  onReport: CallBack<{
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
