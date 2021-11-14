import axios from 'axios';
import faker from 'faker';
import { CallBack } from '../../src/types';
import { promisifyCounterMonitorReport } from '../utils/test-utils';
import { createXHRMonitor } from '../../src';
import { XHRReportData } from '../../src/xhr/types';

const runMonitor = async (cb: CallBack<any>, t?: number) =>
  promisifyCounterMonitorReport<XHRReportData>({
    afterCreateMonitorCallback: cb,
    monitorFactory: createXHRMonitor,
    reportTimesBeforeResolve: t,
  });
describe('xhr monitor', () => {
  it('test xhr error request (GET)', async () => {
    const fakeUrl = faker.image.imageUrl();

    // 一个不支持直接通过 xhr 完成请求的网址
    const [res] = await runMonitor(async () => {
      try {
        await axios.get(fakeUrl, {
          timeout: 2000,
        });
      } catch (e) {
        console.log(e);
      }
    });

    expect(res.eventType).to.equal('XHR');
    expect(res.data.performance).to.be.undefined;
    expect(res.data.duration >= 0).to.be.true;
    expect(res.data.request.href).to.equal(fakeUrl);
    expect(res.data.response.status).to.equal(-1);
  });

  it('test xhr success request', async () => {
    const fakeUrl = 'https://disease.sh/v3/covid-19/historical/all?lastdays=all';

    // 一个不支持直接通过 xhr 完成请求的网址
    const [res] = await runMonitor(async () => {
      try {
        await axios.get(fakeUrl);
      } catch (e) {
        console.log(e);
      }
    });

    expect(res.eventType).to.equal('XHR');
    expect(!!res.data.performance).to.be.true;
    expect(res.data.duration >= 0).to.be.true;
    expect(res.data.request.href).to.equal(fakeUrl);
  });

  it('test xhr success request more than one', async () => {
    const fakeUrl = 'https://disease.sh/v3/covid-19/historical/all?lastdays=all';

    // 一个不支持直接通过 xhr 完成请求的网址
    const res = await runMonitor(async () => {
      try {
        await Promise.all([axios.get(fakeUrl), axios.get(fakeUrl), axios.get(fakeUrl)]);
      } catch (e) {
        console.log(e);
      }
    }, 2);

    expect(res.length).to.equal(2);
    expect(res.every((item) => item.eventType === 'XHR')).to.be.true;
    expect(res.every((item) => item.data.request.href === fakeUrl)).to.be.true;
    expect(res.every((item) => item.data.response.status === 200)).to.be.true;
  });
});
