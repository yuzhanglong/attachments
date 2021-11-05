import { mount } from '@cypress/react';
import React from 'react';

// describe('test fmp monitor layout-significant algorithm', function () {
//   const specWindow = initSpecWindow();
//
//   const applyDomChanges = () => {
//     const el = specWindow.getContainer();
//     el.innerHTML = `<div>hello world</div>`;
//     for (let i = 0; i < 20; i++) {
//       setTimeout(() => {
//         const el1 = document.createElement('div');
//         el1.style.height = '1200px';
//         el1.style.width = '120px';
//         el1.style.backgroundColor = '#409eff';
//         el1.innerHTML = 'hello fmp!';
//         el.appendChild(el1.cloneNode());
//       }, i);
//     }
//   };
//   beforeEach(() => {
//     specWindow.resetContainer();
//   });
//
//   it('test layout-significant algorithm', () => {
//     createFMPMonitor({
//       algorithm: 'layout-significant',
//       onReport: (e) => {
//         console.log(e);
//       },
//     });
//     applyDomChanges();
//   });
// });

describe('test fmp monitor dom-score algorithm', function () {
  it('test dom-score algorithm algorithm', () => {
    const Hello = () => {
      return <div>Hello World!!!</div>;
    };

    mount(<Hello />);
    cy.contains('Hello World!').should('be.visible');
  });
});
