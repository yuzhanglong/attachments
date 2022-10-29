import { createPaintMonitor } from '../../src';
import { promisifyCounterMonitorReport } from '../utils/test-utils';
import type { LargestContentfulPaintReportData, PaintReportData } from '../../src/paint/types';
import type { CallBack } from '../../src/types';

const createMonitor = (cb: CallBack<any>, times: number) =>
  promisifyCounterMonitorReport<PaintReportData & LargestContentfulPaintReportData>({
    monitorFactory: createPaintMonitor,
    afterCreateMonitorCallback: cb,
    reportTimesBeforeResolve: times,
  });

createPaintMonitor({
  onReport: (e) => {
    console.log(e);
  },
});
describe('test assets monitor', () => {
  it('test FP、FCP and LCP', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    let smallElement = null;
    let largestElement = null;

    const insertSmallElement = () => {
      smallElement = document.createElement('div');
      smallElement.style.width = '100px';
      smallElement.style.height = '100px';
      smallElement.style.backgroundColor = '#9375de';
      smallElement.innerHTML = 'I\'m the small element';
      el.appendChild(smallElement);
    };

    const insertLargestElement = () => {
      largestElement = document.createElement('div');
      largestElement.style.width = '300px';
      largestElement.style.height = '300px';
      largestElement.style.backgroundColor = '#409eff';
      largestElement.innerHTML = 'I\'m the largest element!I\'m the largest element!I\'m the largest element!I\'m the largest element!';
      el.appendChild(largestElement);
    };

    // 首先插入一个小的 element，尝试触发第一次 LCP
    insertSmallElement();

    const [p, lcp, lcp2] = await createMonitor(() => {
      // 在插入一个大的 element，触发第一次 LCP
      setTimeout(() => {
        insertLargestElement();
      }, 2000);
    }, 3);
    expect(p.eventType).to.equal('PAINT');
    expect(lcp.eventType).to.equal('LARGEST_CONTENTFUL_PAINT');
    expect(lcp2.eventType).to.equal('LARGEST_CONTENTFUL_PAINT');

    const lcp1Data = lcp.data.largestContentfulPaint;
    const lcp2Data = lcp2.data.largestContentfulPaint;

    // 第一次触发 lcp 的元素
    expect(lcp1Data.element).to.equal(smallElement);

    // 第二次触发 lcp 的元素
    expect(lcp2Data.element).to.equal(largestElement);
  });
});
