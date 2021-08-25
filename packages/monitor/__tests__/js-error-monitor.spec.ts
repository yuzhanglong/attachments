import { createJsErrorMonitor } from '../src';
import { noop } from '../src/utils';

describe('js error monitor', () => {
  test('not browser env(window = undefined, we will not do anything', () => {
    // eslint-disable-next-line no-global-assign
    window = {} as any;
    createJsErrorMonitor({
      onReport: noop,
    });
  });

  test('test common error', () => {
    createJsErrorMonitor({
      onReport: (e) => {
        console.log(e);
      },
    });

    // @ts-ignore
    window.PromiseRejectionEvent = undefined;
    // @ts-ignore
    window.ErrorEvent = undefined;

    const e = new ErrorEvent('error', {
      // @ts-ignore
      error: new Error('hello world!'),
    });
    window.dispatchEvent(e);

  });
});
