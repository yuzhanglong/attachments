/**
 * 合并 依赖配置
 *
 * @author yuzhanglong
 * @param source 旧依赖
 * @param extend 要被合并上的依赖
 * @date 2021-1-30 18:15:53
 */

import { BaseObject } from '../types'
import { logger } from './logger'

export function mergeDependencies(source: BaseObject, extend: BaseObject): BaseObject {
  const result = Object.assign({}, source)

  for (const depName of Object.keys(extend)) {
    const sourceDep = source[depName]
    const extendDep = extend[depName]

    // 值为 null 跳过
    if (extendDep === null) {
      logger.warn(`不合法的版本依赖：${depName}`)
      continue
    }

    // 依赖相同，跳过
    if (sourceDep === extendDep) {
      continue
    }

    result[depName] = extendDep
  }
  return result
}
