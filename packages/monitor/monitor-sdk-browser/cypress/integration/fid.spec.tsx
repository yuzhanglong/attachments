import React from 'react';
import { createFIDMonitor } from '../../src';

describe('test fid monitor', () => {
  it('fid', () => {
    createFIDMonitor({
      onReport: (e) => {
        console.log(e);
      },
    });
    document.body.innerHTML = `<button
            id="btn"
          >
            hello world!
          </button>`;

    setTimeout(() => {
      document.getElementById('btn').click();
    }, 1000);

    // TODO：尝试发现 fid 不能直接通过 .click() 捕获，必须是真实用户的点击，能否改进？
  });
});
