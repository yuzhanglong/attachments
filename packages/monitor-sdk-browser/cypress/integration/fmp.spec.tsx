import React from 'react';
import { mount } from '@cypress/react';
import { getDomLayoutScore } from '../../src/utils/get-dom-layout-score';

describe('test fmp monitor dom-score algorithm', function () {
  it('test dom-score algorithm', async () => {
    const getScore = () =>
      new Promise((resolve) => {
        const getScore = () =>
          getDomLayoutScore(
            document.getElementById('base'),
            1,
            true,
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
