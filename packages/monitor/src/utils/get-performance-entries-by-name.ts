import { isFunction } from 'lodash';
import { getPerformance } from './browser-interfaces';

export const getPerformanceEntriesByName = (name: string) => {
  const performance = getPerformance();

  if (performance && isFunction(performance.getEntriesByName)) {
    return performance.getEntriesByName(name);
  }
  return [];
};
