/// <reference types="@types/jest" />
import { comparePathAndGetDivision, getUrlPaths, removeWWWAndProtocol } from '../src/utils';

describe('test utils', () => {
  test('getUrlPaths()', () => {
    expect(getUrlPaths('www.baidu.com')).toStrictEqual([]);
    expect(getUrlPaths('www.baidu.com/foo/bar/baz')).toStrictEqual(['foo', 'bar', 'baz']);
    expect(getUrlPaths('www.baidu.com/foo/bar/baz/')).toStrictEqual(['foo', 'bar', 'baz']);
    expect(getUrlPaths('www.baidu.com/')).toStrictEqual([]);
  });

  test('removeWWWAndProtocol()', () => {
    expect(removeWWWAndProtocol('www.baidu.com')).toStrictEqual('baidu.com');
    expect(removeWWWAndProtocol('google.com')).toStrictEqual('google.com');
    expect(removeWWWAndProtocol('https://www.google.com')).toStrictEqual('google.com');
    expect(removeWWWAndProtocol('http://www.google.com')).toStrictEqual('google.com');
  });

  test('comparePathAndGetDivision()', () => {
    const cmp1 = comparePathAndGetDivision(['foo', 'bar', 'baz'], ['foo', 'bar']);
    expect(cmp1).toStrictEqual({
      samePaths: ['foo', 'bar'],
      otherPaths: ['baz'],
      dividedPos: 2,
    });
  });

  const cmp2 = comparePathAndGetDivision(['aaa', 'bbb'], ['ccc', 'ddd']);

  expect(cmp2).toStrictEqual({
    samePaths: [],
    otherPaths: [],
    dividedPos: -1,
  });

  const cmp3 = comparePathAndGetDivision(['aaa', 'bbb'], []);

  expect(cmp3).toStrictEqual({
    samePaths: [],
    otherPaths: ['aaa', 'bbb'],
    dividedPos: 0,
  });
});
