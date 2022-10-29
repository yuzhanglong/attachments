import { noop } from 'lodash';
import type { CallBack, ReportBase } from '../../src/types';
import { MonitorOptions } from '../../src/types';
import { MPFIDMonitorOptions } from '../../src/mpfid/types';

interface PromisifyMonitorReportOptions<T> {
  // monitor 的工厂函数
  monitorFactory: CallBack<any>

  // 在 monitor 创建后做些什么
  afterCreateMonitorCallback?: CallBack<any>

  // 在 onReport 方法调用多少次后将 promise resolve
  reportTimesBeforeResolve?: number
}

/**
 * 将一个 monitor 实例 promisify
 *
 * @author yuzhanglong
 * @date 2021-10-30 20:57:11
 * @param options 相关选项，见上面代码
 * @param monitorOptions 监控程序配置
 */
export const promisifyCounterMonitorReport = <MonitorReportData>(
  options: PromisifyMonitorReportOptions<MonitorReportData>,
  monitorOptions?: Record<any, any>,
) => {
  const { monitorFactory, afterCreateMonitorCallback = noop, reportTimesBeforeResolve = 1 } = options;
  return new Promise<ReportBase<MonitorReportData>[]>((resolve) => {
    const reportData = [];

    // 如果次数为 0 直接 resolve 即可
    if (reportTimesBeforeResolve === 0)
      resolve([]);

    monitorFactory({
      onReport: (e) => {
        reportData.push(e);
        if (reportData.length >= reportTimesBeforeResolve)
          resolve(reportData.slice());
      },
      ...(monitorOptions || {}),
    });
    afterCreateMonitorCallback();
  });
};

/**
 * cypress 在一个 spec 中有两个 window（即两个 iframe），一个被称为 spec window，一个被称为 app window
 *
 * 在 spec 中的代码的 window.xxx 会指向 spec window，而这个 window 是不可见的，在我们计算 fp/fcp 是会拿不到相应的值
 * 所以我们要修改对应 iframe 的样式，让其可见。
 *
 * @author yuzhanglong
 * @date 2021-10-31 21:02:48
 * @deprecated 由于使用了 component 模式，废弃之
 */
export const initSpecWindow = () => {
  // 由于不是跨域的，可以直接通过 parent 拿到父亲节点 window
  const data = parent.window.document;
  // 插入一个 style 标签，给予 visibility 属性为 initial
  const el = document.createElement('style');
  el.setAttribute('type', 'text/css');
  el.innerHTML = '.spec-iframe{height: 100% !important;width: 100% !important;visibility: initial !important;background-color: #ffffff !important}';
  data.body.appendChild(el);

  const testContainer = document.createElement('div');
  testContainer.innerHTML = '';
  testContainer.id = 'spec-container';
  document.body.appendChild(testContainer);

  const resetContainer = () => {
    testContainer.innerHTML = '';
  };

  const getContainer = () => {
    return testContainer;
  };

  return {
    resetContainer,
    getContainer,
  };
};
