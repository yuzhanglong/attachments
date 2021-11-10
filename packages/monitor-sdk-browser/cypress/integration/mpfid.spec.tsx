import { createMPFIDMonitor } from '../../src';
import { noop } from 'lodash';

describe('test mpfid monitor', () => {
  it('mpfid', async () => {
    const m = createMPFIDMonitor({
      onReport: noop,
    });

    const resTasks: PerformanceEntry[] = [];

    const o = new PerformanceObserver((list) => {
      resTasks.push(...list.getEntries());
    });
    o.observe({
      entryTypes: ['longtask'],
    });

    //递归版的斐波那契数列，比较耗时的一个任务，可以作为 long task
    const fib = (n: number) => {
      if (n <= 2) {
        return 1;
      }
      return fib(n - 1) + fib(n - 2);
    };
    await Promise.all([
      new Promise((resolve) =>
        setTimeout(() => {
          console.log(`fib(40) = ${fib(40)}`);
          resolve(true);
        }, 1000)
      ),
      new Promise((resolve) =>
        setTimeout(() => {
          console.log(`fib(40) = ${fib(40)}`);
          resolve(true);
        }, 2000)
      ),
      new Promise((resolve) =>
        setTimeout(() => {
          console.log(`fib(40) = ${fib(40)}`);
          resolve(true);
        }, 3000)
      ),
    ]);

    await new Promise((resolve) => setTimeout(() => resolve(true), 1000));

    expect(resTasks.length).to.equals(3);

    const total = resTasks.reduce((total, task) => {
      return task.duration > total ? task.duration : total;
    }, 0);

    expect(total).to.equal(m.getReportData());
  });
});
