/*
 * File: runtimeManager.spec.ts
 * Description: runtimeManager 单元测试
 * Created: 2021-2-23 01:49:17
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as path from 'path'
import { RuntimeManager, Script } from '../src'


describe('runtimeManager 测试', () => {
  test('尝试加载本地 package.json', () => {
    const rm = new RuntimeManager(path.resolve(__dirname, '../'))
    expect(rm.appManager.getPackageConfig()['name'])
      .toStrictEqual('@attachments/serendipity-core')
  })

  test('尝试命令执行', () => {
    const logger = console.log = jest.fn()
    const rm = new RuntimeManager(path.resolve(__dirname, '../'))

    class FooPlugin {
      @Script('start')
      start() {
        console.log('hello world')
      }

      @Script('build')
      build() {
        console.log('hello build')
      }
    }

    rm.registerPlugin(FooPlugin)
    rm.runCommand('start')

    expect(logger).toBeCalledWith('hello world')

    rm.runCommand('build')
    expect(logger).toBeCalledWith('hello build')
  })
})