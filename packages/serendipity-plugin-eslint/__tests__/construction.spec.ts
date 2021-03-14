/*
 * File: construction.spec.ts
 * Description: plugin 测试
 * Created: 2021-3-14 15:49:43
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import PluginConstructorTester from '@attachments/serendipity-public/bin/utils/testUtils/PluginConstructorTester'
import SerendipityEslintPlugin from '../src'

describe('eslint plugin construction 测试', () => {
  test('', () => {
    const cm = new PluginConstructorTester(SerendipityEslintPlugin)
    cm
      .inquiry({
        environment: 'React',
        extendConfig: 'Airbnb',
        useTypeScript: false
      })
      .testConstructionPackageJson({
        'foo': '1.0'
      })
  })
})