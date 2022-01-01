import { isFunction } from 'lodash';
import { getPerformance } from './browser-interfaces';

/**
 * 根据 entry 名称获取 entry，如果浏览器不兼容，返回一个空数组
 *
 * @author yuzhanglong
 * @date 2021-09-12 11:12:21
 * @param name entry 名称
 */
export const getPerformanceEntriesByName = (name: string) => {
  const performance = getPerformance();

  if (performance && isFunction(performance.getEntriesByName)) {
    return performance.getEntriesByName(name);
  }
  return [];
};

/**
 * 根据 entry 类型获取 entry，如果浏览器不兼容，返回一个空数组
 *
 * @author yuzhanglong
 * @date 2021-09-12 11:12:21
 * @param type entry 名称
 */
export const getPerformanceEntriesByType = (type: string) => {
  const performance = getPerformance();
  if (performance && isFunction(performance.getEntriesByType)) {
    return performance.getEntriesByType(type);
  }
  return [];
};
