import { createClsMonitor } from '../../src';
import { noop } from 'lodash';
import { mount } from '@cypress/react';
import React, { useEffect, useState } from 'react';
import { EventType, ReportBase } from '../../src/types';
import { ClsReportData } from '../../src/cls/types';

describe('test cls monitor', () => {
  it('test cls monitor', async () => {
    const m = createClsMonitor({
      onReport: noop,
    });

    const Cmp = () => {
      const [count, setCount] = useState<number>(0);
      useEffect(() => {
        setTimeout(() => {
          setCount(10);
        }, 1000);
        setTimeout(() => {
          setCount(100);
        }, 2000);
      }, []);

      return (
        <div id={'my-world'}>
          {new Array(count).fill('').map((item, index) => (
            <div key={index}>Added DOM</div>
          ))}
          <div>hello world</div>
        </div>
      );
    };

    mount(<Cmp />);

    const res = await new Promise<ReportBase<ClsReportData>>((resolve, reject) => {
      setTimeout(() => {
        resolve(m.getReportData());
      }, 4000);
    });

    expect(res.eventType === EventType.CUMULATIVE_LAYOUT_SHIFT);
    expect(res.data.clsValue > 0).to.be.true;
    expect(res.data.entries.length).to.equal(2);

    console.log(res);
  });
});
