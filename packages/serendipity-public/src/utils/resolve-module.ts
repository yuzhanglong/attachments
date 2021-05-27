/**
 * File: resolve-module.ts
 * Description: resolveModule
 * Created: 2021-5-27 23:35:13
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

export const resolveModule = (path: string) => {
  return require(path)
}

