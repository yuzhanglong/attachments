/**
 * File: utils.spec.ts
 * Description: 工具函数测试
 * Created: 2021-08-12 23:41:00
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { comparePathAndGetDivision, getUrlPaths } from '../src/utils';

describe('test utils', () => {
  test('test getUrlPaths()', () => {
    expect(getUrlPaths('www.baidu.com')).toStrictEqual([]);
    expect(getUrlPaths('www.baidu.com/foo/bar/baz')).toStrictEqual(['foo', 'bar', 'baz']);
    expect(getUrlPaths('www.baidu.com/foo/bar/baz/')).toStrictEqual(['foo', 'bar', 'baz']);
    expect(getUrlPaths('www.baidu.com/')).toStrictEqual([]);
  });

  test('test comparePathAndGetDivision()', () => {
    const cmp1 = comparePathAndGetDivision(
      [
        'foo',
        'bar',
        'baz',
      ],
      [
        'foo',
        'bar',
      ],
    );
    expect(cmp1).toStrictEqual({
      samePaths: ['foo', 'bar'],
      otherPaths: ['baz'],
      dividedPos: 2,
    });
  });

  const cmp2 = comparePathAndGetDivision(
    [
      'aaa',
      'bbb',
    ],
    [
      'ccc',
      'ddd',
    ],
  );

  expect(cmp2).toStrictEqual({
    samePaths: [],
    otherPaths: [],
    dividedPos: -1,
  });

  const cmp3 = comparePathAndGetDivision(
    [
      'aaa',
      'bbb',
    ],
    [],
  );

  expect(cmp3).toStrictEqual({
    samePaths: [],
    otherPaths: ['aaa', 'bbb'],
    dividedPos: 0,
  });
});
