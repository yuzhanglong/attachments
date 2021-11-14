import { createFetchMonitor } from '../../src/fetch/fetch-monitor';

describe('test fetch API', function () {
  it('fetch', () => {
    createFetchMonitor({
      onReport: (e) => {
        console.log(e);
      },
    });

    fetch('https://api.github.com/users/yuzhanglong')
      .then((response) => response.json())
      .then((json) => console.log(json))
      .catch((err) => console.log('Request Failed', err));
  });
});
