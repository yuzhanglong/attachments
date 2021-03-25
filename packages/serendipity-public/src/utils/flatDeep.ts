/*
 * File: flatDeep.ts
 * Description: 数组拍平
 * Created: 2021-3-26 00:42:43
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


const flatDeep = (arr: never[], depth?: number) => {
  if (!depth) {
    depth = 1
  }

  if (depth > 0) {
    return arr.reduce((acc, val) => {
      return acc.concat(Array.isArray(val) ? flatDeep(val, depth - 1) : val)
    }, [])
  }
  return arr.slice()
}

export default flatDeep