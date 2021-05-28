/*
 * File: flatDeep.ts
 * Description: 数组拍平
 * Created: 2021-3-26 00:42:43
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

/**
 * 数组扁平化
 *
 * @author yuzhanglong
 * @param arr 目标数组
 * @param depth 深度
 * @return boolean 是否写入成功
 * @date 2021-5-27 18:56:20
 */
export const arrayFlat = (arr: any[], depth?: number) => {
  if (!depth) {
    depth = 1
  }

  if (depth > 0) {
    return arr.reduce((acc, val) => {
      return acc.concat(Array.isArray(val) ? arrayFlat(val, depth - 1) : val)
    }, [])
  }
  return arr.slice()
}
