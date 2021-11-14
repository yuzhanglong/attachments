import { CallBack } from '../../src/types';
import { promisifyCounterMonitorReport } from '../utils/test-utils';
import { createFetchMonitor } from '../../src/fetch/fetch-monitor';
import { FetchReportData } from '../../src/fetch/types';

const runMonitor = async (cb: CallBack<any>, times?: number) =>
  promisifyCounterMonitorReport<FetchReportData>({
    afterCreateMonitorCallback: cb,
    monitorFactory: createFetchMonitor,
    reportTimesBeforeResolve: times,
  });

describe('test fetch API(200 code)', function () {
  it('test fetch (GET)', async () => {
    const [res] = await runMonitor(() => {
      fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all', {
        method: 'get',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log(res);
        });
    });

    expect(res.eventType).to.equal('FETCH');
    expect(res.data.response.status).to.equal(200);
    expect(!!res.data.performance).to.be.true;
    // 只有400+的请求才会触发
    expect(res.data.response.body).to.be.null;
  });

  it('test fetch error(404 code)', async () => {
    const [res] = await runMonitor(() => {
      fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all', {
        method: 'post',
        body: 'a=1&b=2',
      });
    });

    expect(res.eventType).to.equal('FETCH');
    expect(res.data.response.status).to.equal(404);
    expect(!!res.data.performance).to.be.true;
    // 只有400+的请求才会触发
    expect(!!res.data.response.body).to.be.true;
  });

  it('test success request more than one', async () => {
    const res = await runMonitor(() => {
      Promise.all([
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all', {
          method: 'get',
        }),
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all', {
          method: 'get',
        }),
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all', {
          method: 'get',
        }),
      ]);
    }, 3);

    expect(res.length).to.equal(3);
    expect(res.every((item) => item.eventType === 'FETCH')).to.be.true;
    expect(res.every((item) => item.data.response.status === 200)).to.be.true;
  });
});
