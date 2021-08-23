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
  XHR = 'XHR'
}
