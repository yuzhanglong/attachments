import { createAssetsMonitor } from '../../src';
import faker from 'faker';
import { ReportBase } from '../../src/types';
import { AssetsReportData } from '../../src/assets/types';

const createAndInsertImageTag = () => {
  const img = document.createElement('img');
  img.src = faker.image.imageUrl(1, 1, undefined, true);
  document.body.appendChild(img);
};

describe('test assets monitor', () => {
  beforeEach(() => {
    // cypress 单测不方便执行 reload，所以两个 it 共享了同一个 window 实例，
    // 导致上一个单测的结果也被统计进来了,所以要把所有的 performance 信息全部清空
    performance.clearResourceTimings();
  });

  it('test create images before monitor creation', async () => {
    const res = await new Promise<ReportBase<AssetsReportData>[]>((resolve) => {
      createAndInsertImageTag();
      createAndInsertImageTag();
      createAndInsertImageTag();

      const data = [];
      createAssetsMonitor({
        onReport: (e) => {
          if (e.data.performance.name.includes('placeimg.com')) {
            data.push(e);
          }
          if (data.length === 3) {
            resolve(data);
          }
        },
      });
    });

    expect(res.every((item) => item.eventType === 'ASSETS')).to.be.true;
  });

  it('test create images after monitor creation', async () => {
    const res = await new Promise<ReportBase<AssetsReportData>[]>((resolve) => {
      const data = [];
      createAssetsMonitor({
        onReport: (e) => {
          if (e.data.performance.name.includes('placeimg.com')) {
            data.push(e);
          }
          if (data.length === 3) {
            resolve(data);
          }
        },
      });
      createAndInsertImageTag();
      createAndInsertImageTag();
      createAndInsertImageTag();
    });

    expect(res.length).to.equal(3);

    expect(res.every((item) => item.eventType === 'ASSETS')).to.be.true;
  });
});
