/**
 * File: utils.spec.ts
 * Description: 工具函数测试
 * Created: 2021-08-12 23:41:00
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { getUrlPaths } from '../src/utils';

describe('test utils', () => {
  test('test getUrlPaths()', () => {
    expect(getUrlPaths('www.baidu.com')).toStrictEqual([]);
    expect(getUrlPaths('www.baidu.com/foo/bar/baz')).toStrictEqual(['foo', 'bar', 'baz']);
    expect(getUrlPaths('www.baidu.com/foo/bar/baz/')).toStrictEqual(['foo', 'bar', 'baz']);
    expect(getUrlPaths('www.baidu.com/')).toStrictEqual([]);
  });
});
