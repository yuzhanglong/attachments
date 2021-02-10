/*
 * File: utils.ts
 * Description: 工具函数
 * Created: 2021-2-10 11:17:03
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


// 以某个回调函数为条件过滤数组
export const uniqueBy = <T>(arr: T[], fun: (args: T) => string): T[] => {
  const appeared = {}
  return arr.filter(el => {
    const element = fun(el)
    if (appeared.hasOwnProperty(element)) {
      return false
    } else {
      appeared[element] = true
      return true
    }
  })
}