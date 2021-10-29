import { createAssetsErrorMonitor } from '../../src';
import { CallBack } from '../../src/types';
import { AssetsErrorReportData } from '../../src/assets-error/types';
import faker from 'faker';
import { promisifyMonitorReport } from './test-utils';

const runMonitor = async (cb: CallBack<any>) =>
  promisifyMonitorReport<AssetsErrorReportData>({
    afterCreateMonitorCallback: cb,
    monitorFactory: createAssetsErrorMonitor,
  });

// 故意加一个 https 保证资源不存在
const fakeSrc = `https://${faker.image.imageUrl()}`;

describe('test asset error monitor', () => {
  it('test <img> tag that the source is not accessible', async () => {
    const [res] = await runMonitor(() => {
      const el = document.createElement('img');
      el.src = fakeSrc;
      document.body.appendChild(el);
    });

    expect(res.eventType).equals('ASSETS_ERROR');
    expect(res.data.url).equals(fakeSrc);
    expect(res.data.tagName).equals('img');
  });

  it('test <link> tag that the source is not accessible', async () => {
    const [res] = await runMonitor(() => {
      const el = document.createElement('link');
      el.href = fakeSrc;
      el.rel = 'stylesheet';
      el.type = 'text/css';
      document.body.appendChild(el);
    });

    expect(res.eventType).equals('ASSETS_ERROR');
    expect(res.data.url).equals(fakeSrc);
    expect(res.data.tagName).equals('link');
  });

  it('test <script/> tag that the source is not accessible', async () => {
    const [res] = await runMonitor(() => {
      const el = document.createElement('script');
      el.src = fakeSrc;
      document.body.appendChild(el);
    });

    expect(res.eventType).equals('ASSETS_ERROR');
    expect(res.data.url).equals(fakeSrc);
    expect(res.data.tagName).equals('script');
  });

  it('test <video/> tag that the source is not accessible', async () => {
    const [res] = await runMonitor(() => {
      const el = document.createElement('video');
      el.src = fakeSrc;
      document.body.appendChild(el);
    });

    expect(res.eventType).equals('ASSETS_ERROR');
    expect(res.data.url).equals(fakeSrc);
    expect(res.data.tagName).equals('video');
  });

  it('test <audio/> tag that the source is not accessible', async () => {
    const [res] = await runMonitor(() => {
      const el = document.createElement('audio');
      el.src = fakeSrc;
      document.body.appendChild(el);
    });

    expect(res.eventType).equals('ASSETS_ERROR');
    expect(res.data.url).equals(fakeSrc);
    expect(res.data.tagName).equals('audio');
  });

  it('test new Image() instance', async () => {
    const [res] = await runMonitor(() => {
      // Image() 函数将会创建一个新的 HTMLImageElement 实例。
      // 它的功能等价于 document.createElement('img')
      const img = new Image();
      img.src = fakeSrc;
      document.body.appendChild(img);
    });

    expect(res.eventType).equals('ASSETS_ERROR');
    expect(res.data.url).equals(fakeSrc);
    expect(res.data.tagName).equals('img');
  });

  it('test new Audio() instance', async () => {
    const [res] = await runMonitor(() => {
      const audio = new Audio();
      audio.src = fakeSrc;
      document.body.appendChild(audio);
    });

    expect(res.eventType).equals('ASSETS_ERROR');
    expect(res.data.url).equals(fakeSrc);
    expect(res.data.tagName).equals('audio');
  });
});
