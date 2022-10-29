import type { MethodKeys } from '../types';

/**
 * patch 一个方法（方法劫持）
 *
 * @author yuzhanglong
 * @date 2021-08-22 20:41:45
 * @param obj 被劫持的对象
 * @param key 需要劫持的 key
 * @param patchFn 劫持回调，劫持回调返回一个函数（即覆盖后的函数），其中：
 * 回调的第一个参数为将要被覆盖的对象
 * 第二个参数为携带的参数（可选）
 * @return function 返回一个函数，当这个函数被调用后，劫持工作将被执行
 */
export const patchMethod = <O extends {}, K extends MethodKeys<O>, P extends any[]>(
  obj: O,
  key: K,
  patchFn: (origin: O[K], ...params: P) => O[K] & Function,
) => {
  return (...params: P) => {
    obj[key] = patchFn(obj[key], ...params);
  };
};
