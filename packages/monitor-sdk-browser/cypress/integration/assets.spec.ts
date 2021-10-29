import { createAssetsMonitor } from '../../src';
import faker from 'faker';
import { CallBack } from '../../src/types';
import { promisifyMonitorReport } from './test-utils';
import { AssetsReportData } from '../../src/assets/types';

const createAndInsertImageTag = () => {
  const img = document.createElement('img');
  img.src = faker.image.imageUrl(1, 1, undefined, true);
  document.body.appendChild(img);
};

const runMonitor = async (cb: CallBack<any>, times: number) =>
  promisifyMonitorReport<AssetsReportData>({
    afterCreateMonitorCallback: cb,
    monitorFactory: createAssetsMonitor,
    reportTimesBeforeResolve: times,
  });

describe('test assets monitor', () => {
  it('test create images after monitor creation', async () => {
    const res = await runMonitor(() => {
      createAndInsertImageTag();
      createAndInsertImageTag();
      createAndInsertImageTag();
    }, 3);
    expect(res.length).to.equal(3);
    res.forEach((item) => {
      expect(item.eventType).to.equal('ASSETS');
    });
  });

  it('test create images before monitor creation', async () => {
    // 在监控程序开始前尝试去加载了一些图片
    createAndInsertImageTag();
    createAndInsertImageTag();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const res = await runMonitor(() => {
      createAndInsertImageTag();
      createAndInsertImageTag();
      createAndInsertImageTag();
    }, 5);
    // 监听收到五次 + 开始的两次
    expect(res.length).to.equal(7);
    res.forEach((item) => {
      expect(item.eventType).to.equal('ASSETS');
    });
  });
});
