/*
 * File: container.spec.ts
 * Description: container 测试
 * Created: 2021-2-19 23:49:27
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { Inquiry, Script, SerendipityPlugin } from '../src/core/decorators'
import PluginFactory from '../src/core/pluginFactory'

describe('pluginFactory 测试', () => {
  test('@script 元数据注册', () => {
    class FooPlugin {

      @Script('start')
      reactStart(): string {
        return 'react start return'
      }

      @Script('build')
      reactBuild(): string {
        return 'react build return'
      }

      foo(): string {
        return 'foo'
      }
    }

    const pluginFactory = new PluginFactory(FooPlugin)
    const scriptMetas = pluginFactory.getPluginMetaData().scripts

    const names = scriptMetas.map(res => res.command)

    // 收集 scripts
    expect(names).toStrictEqual(
      [
        'start',
        'build'
      ]
    )

    // 收集 methods
    const methods = scriptMetas.map(res => res.methodName)
    expect(methods).toStrictEqual([
      'reactStart',
      'reactBuild'
    ])

    const instance = pluginFactory.getPluginInstance()
    // 尝试执行 script
    expect(instance[methods[0]]()).toStrictEqual('react start return')
    expect(instance[methods[1]]()).toStrictEqual('react build return')
  })


  test('@SerendipityPlugin 元数据注册', () => {
    @SerendipityPlugin('FooPlugin')
    class FooPlugin {
      // hello world!
    }

    const pluginFactory = new PluginFactory(FooPlugin)
    expect(pluginFactory.getPluginMetaName()).toStrictEqual('FooPlugin')
  })

  test('@Inquiry 元数据注册', () => {
    class InquiryPlugin {
      @Inquiry()
      tryInquiry() {
        return [
          {
            type: 'list',
            message: '请选择一个开发语言'
          }
        ]
      }

      @Script('foo')
      tryInquiryTwo() {
        console.log('foo~')
      }
    }

    const pluginFactory = new PluginFactory(InquiryPlugin)
    expect(pluginFactory.getPluginMetaData().inquiryMethodNames)
      .toStrictEqual([
        'tryInquiry'
      ])

    const instance = pluginFactory.getPluginInstance()

    expect(instance['tryInquiry']()).toStrictEqual([
      {
        type: 'list',
        message: '请选择一个开发语言'
      }
    ])
  })
})