export interface ObservedResourceRequests {
  start: number;
  end: number;
}

interface Endpoint {
  timestamp: number,
  type: 'request-start' | 'request-end'
}

/**
 * 计算当前时间点之前，距离最近的、同时进行的网络请求数量 >= 2 的时机，单位为毫秒
 *
 * @author yuzhanglong
 * @date 2021-09-05 23:49:27
 * @param incompleteRequestStarts 已经开始但未结束的网络请求（你可以通过 劫持 XMLHttpRequest 来得到）
 * @param observedResourceRequests 已经监听到的网络(资源)请求（你可以通过 Performance API 来得到）
 */
export const computeLastKnownNetwork2Busy = (
  incompleteRequestStarts: number[],
  observedResourceRequests: ObservedResourceRequests[],
) => {
  // 当前进行的请求超过 2 个，直接返回当前时间
  if (incompleteRequestStarts.length > 2) {
    return performance.now();
  }

  // endpoints 包含了每个请求的开始时间点和结束时间点，最后会按时间先后顺序排序
  const endpoints: Endpoint[] = [];

  for (const req of observedResourceRequests) {
    endpoints.push({
      timestamp: req.start,
      type: 'request-start',
    });

    endpoints.push({
      timestamp: req.end,
      type: 'request-end',
    });
  }

  for (const incompleteRequestStart of incompleteRequestStarts) {
    endpoints.push({
      timestamp: incompleteRequestStart,
      type: 'request-start',
    });
  }


  endpoints.sort((a, b) => a.timestamp - b.timestamp);

  // 开始【时间倒推】，首先初始化当前活跃的请求数目
  // 接下来，如果是请求开始阶段，则将此时活跃的请求数 - 1，反之 + 1
  // 如果在某一个时刻 currentActive 的值大于 2，那么这个时候就是当前时间点之前，距离最近的、同时进行的网络请求数量 >= 2 的时机
  let currentActive = incompleteRequestStarts.length;

  for (let i = endpoints.length - 1; i >= 0; i -= 1) {
    const endpoint = endpoints[i];
    switch (endpoint.type) {
      case 'request-start':
        currentActive -= 1;
        break;
      case 'request-end':
        currentActive += 1;
        if (currentActive > 2) {
          return endpoint.timestamp;
        }
        break;
      default:
        throw Error('Internal Error: This should never happen');
    }
  }
  return 0;
};
