import type { BaseObject } from '../types';

/**
 * 传入多个 key, 将 object1 对应的值赋值到 object2 对应的值
 *
 * @author yuzhanglong
 * @date 2021-08-23 00:47:02
 */
export const assignKeysBetweenObjects = (obj1: BaseObject, obj2: BaseObject, keys: string[]) => {
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];

    obj2[k] = obj1[k];
  }
};
