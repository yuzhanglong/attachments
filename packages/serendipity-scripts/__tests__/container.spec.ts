/*
 * File: container.spec.ts
 * Description: container 测试
 * Created: 2021-2-19 23:49:27
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { Command, SerendipityPlugin } from '../src/core/decorators'

describe('container 测试', () => {
  test('command 注册', () => {

    @SerendipityPlugin('FooPlugin')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class FooPlugin {
      @Command('start')
      reactStart() {
        console.log('react start!')
      }

      @Command('build')
      reactBuild() {
        console.log('react build!')
      }
    }
  })
})