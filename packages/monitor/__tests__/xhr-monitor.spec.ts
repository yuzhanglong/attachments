import { noop } from '../src/utils';
import { XhrMonitor } from '../src/xhr-monitor';

const createXMLHttpRequestMock = (options) => {
  const mock = {
    open: jest.fn(),
    send: jest.fn(),
    readyState: 4,
    status: options?.status ?? 200,
    responseType: 'text',
    responseText: 'responseText',
    response: 'response',
    onreadystatechange: jest.fn(),
    setRequestHeader: noop,
    getAllResponseHeaders: () => '',
    getResponseHeader: {  },
  };

  const XMLHttpRequest = jest.fn();
  XMLHttpRequest.prototype = mock;
  return XMLHttpRequest;
};

describe('test xhr monitor', () => {
  console.log(window);

  test('test xhr', () => {
    const m = new XhrMonitor();
    m.patch();
  });
});
