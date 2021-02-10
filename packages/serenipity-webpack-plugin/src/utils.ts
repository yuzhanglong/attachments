/*
 * File: utils.ts
 * Description: 工具函数
 * Created: 2021-2-10 11:17:03
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


// 以某个回调函数为条件过滤数组
import { ChunkInfo } from './types'

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

// 格式化体积
export const formatSize = (size: number): string => {
  // 1MB 对应的 KB 大小，当文件超过这个值时单位会使用 MB
  const ONE_MB_SIZE_IN_BYTE = 1024 * 1024

  if (!size) {
    return '--'
  }

  // 数字太大 我们使用 MB 来表示
  if (size > ONE_MB_SIZE_IN_BYTE) {
    return (size / ONE_MB_SIZE_IN_BYTE).toFixed(2).toString() + ' MB'
  } else {
    return (size / 1024).toFixed(2).toString() + ' KB'
  }
}

// 获取 chunk 信息, 默认最多显示十条记录
export const getChunkInfo = (chunksInfo: ChunkInfo[], showAmount?: number): string[][] => {
  chunksInfo = chunksInfo
    .sort((a, b) => {
      return b.size - a.size
    })
    .slice(0, showAmount || 10)
  return chunksInfo.map(info => {
    return [
      info.files[0],
      formatSize(info.size)
    ]
  })
}