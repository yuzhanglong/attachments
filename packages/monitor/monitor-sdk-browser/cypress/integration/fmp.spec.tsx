import React from 'react';
import { mount } from '@cypress/react';
import { getDomLayoutScore } from '../../src';
import { calculateFMP } from '../../src/fmp/fmp-monitor';

describe('test fmp monitor dom-score algorithm', function () {
  const getScore = (isNotExact?: boolean) => {
    return new Promise((resolve) => {
      const getScore = () =>
        getDomLayoutScore(
          document.getElementById('base'),
          1,
          false,
          !isNotExact,
          (element, score, depth, isPositionCheckNeeded) => {
            const el = document.createElement('div');
            el.innerHTML = `isPositionCheckNeeded:${String(isPositionCheckNeeded)}, depth:${depth}, score: ${score}`;
            element.appendChild(el);
          }
        );

      let isCalled = false;
      new MutationObserver(() => {
        if (!isCalled) {
          isCalled = true;
          resolve(getScore());
        }
      }).observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  };

  it('test fmp calculator', () => {
    const res = calculateFMP([
      {
        time: 0,
        domScore: 10,
      },
      {
        time: 110,
        domScore: 20,
      },
      {
        time: 220,
        domScore: 1200,
      },
      {
        time: 1220,
        domScore: 1000,
      },
    ]);

    expect(res.time).to.equals(220);
    expect(res.maxDelta).to.equals(1180);

    const res2 = calculateFMP([
      {
        time: 0,
        domScore: 10,
      },
    ]);

    expect(res2.time).to.equals(0);
    expect(res2.maxDelta).to.equals(10);

    const res3 = calculateFMP([]);

    expect(res3.time).to.equals(-1);
    expect(res3.maxDelta).to.equals(-1);
  });

  it('test visibility = hidden, the score should be zero', async () => {
    const Cmp = () => {
      // 元素不可见但是有宽高
      return (
        <div
          id={'base'}
          style={{
            border: '1px solid',
            visibility: 'hidden',
          }}
        >
          base
        </div>
      );
    };

    mount(<Cmp />);
    const score = await getScore(true);
    expect(score).to.equals(1.5);
  });

  it('test not exact check', async () => {
    const Cmp = () => {
      // 元素不可见但是有宽高
      return (
        <div
          id={'base'}
          style={{
            border: '1px solid',
            visibility: 'hidden',
          }}
        >
          base
        </div>
      );
    };

    mount(<Cmp />);
    const score = await getScore();
    expect(score).to.equals(0);
  });

  it('test height = 0, the score should be zero', async () => {
    const Cmp = () => {
      // 元素不可见但是有宽高
      return (
        <div
          id={'base'}
          style={{
            height: 0,
          }}
        >
          hello
        </div>
      );
    };

    mount(<Cmp />);
    const score = await getScore();
    expect(score).to.equals(0);
  });

  it('test width = 0, the score should be zero', async () => {
    const Cmp = () => {
      // 元素不可见但是有宽高
      return (
        <div
          id={'base'}
          style={{
            width: 0,
          }}
        >
          hello
        </div>
      );
    };

    mount(<Cmp />);
    const score = await getScore();
    expect(score).to.equals(0);
  });

  it('test display = none, the score should be zero', async () => {
    const Cmp = () => {
      // 元素不可见
      return (
        <div
          id={'base'}
          style={{
            border: '1px solid',
            display: 'none',
          }}
        >
          base
        </div>
      );
    };

    mount(<Cmp />);
    const score = await getScore();
    expect(score).to.equals(0);
  });

  it('test dom-score algorithm', async () => {
    const css = document.createElement('style');
    css.innerHTML = `#base {
        border: 1px solid;
        padding: 5px;
      }

      .c1,
      .c2,
      .c3,
      .cc1,
      .cc2 {
        border: 1px solid;
        padding: 5px;
        margin: 5px;
      }`;
    document.head.appendChild(css);
    const Cmp = () => {
      return (
        <div id="base">
          base
          <div className="c1">
            c1
            <div className="cc1">cc1</div>
            <div className="cc2">cc2</div>
          </div>
          <div className="c2">c2</div>
          <div className="c3">
            <div className="cc1">cc1</div>
            <div className="cc2">
              <div className="cc1">cc1</div>
              <div className="cc2">
                <div className="cc1">cc1</div>
                <div className="cc2">
                  <div className="cc1">cc1</div>
                  <div className="cc2">
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                    <div className="cc1">cc1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    mount(<Cmp />);

    const score = await getScore();
    expect(score).to.equals(110.5);
  });
});
