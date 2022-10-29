import { createMPFIDMonitor } from '../../src';
import type { CallBack } from '../../src/types';
import { EventType } from '../../src/types';
import { promisifyCounterMonitorReport } from '../utils/test-utils';
import type { MPFIDReportData } from '../../src/mpfid/types';

const runMonitor = async (cb: CallBack<any>) =>
  promisifyCounterMonitorReport<MPFIDReportData>(
    {
      afterCreateMonitorCallback: cb,
      monitorFactory: createMPFIDMonitor,
    },
    {
      timeout: 2000,
    },
  );

describe('test mpfid monitor', () => {
  it('mpfid', async () => {
    const data = await runMonitor(async () => {
      // 递归版的斐波那契数列，比较耗时的一个任务，可以作为 long task
      const fib = (n: number) => {
        if (n <= 2)
          return 1;

        return fib(n - 1) + fib(n - 2);
      };
      await Promise.all([
        new Promise(resolve =>
          setTimeout(() => {
            console.log(`fib(40) = ${fib(40)}`);
            resolve(true);
          }, 1000),
        ),
      ]);
    });

    expect(data.length).to.equal(1);
    const res = data.pop();
    expect(res.eventType).to.equal(EventType.MPFID);
    expect(res.data.mpfid > 0).to.be.true;
  });
});
