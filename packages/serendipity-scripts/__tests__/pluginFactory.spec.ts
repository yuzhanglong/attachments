/*
 * File: container.spec.ts
 * Description: container 测试
 * Created: 2021-2-19 23:49:27
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { Construction, Inquiry, Runtime, Script, SerendipityPlugin } from '../src'
import PluginFactory from '../src/core/pluginFactory'

// eslint-disable-next-line max-lines-per-function
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

    const pluginFactory = new PluginFactory({
      requireResult: FooPlugin
    })
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

    const pluginFactory = new PluginFactory({
      requireResult: FooPlugin
    })
    expect(pluginFactory.getPluginMetaName()).toStrictEqual('FooPlugin')
  })

  test('plugin 自定义参数支持', () => {
    const callFn = jest.fn((opt) => {
      expect(opt).toStrictEqual({
        foo: 'hello',
        bar: 'world'
      })
    })

    class ParamPlugin {
      constructor(options: unknown) {
        callFn(options)
      }
    }

    new PluginFactory({
      requireResult: ParamPlugin,
      options: {
        foo: 'hello',
        bar: 'world'
      }
    })
    expect(callFn).toBeCalledTimes(1)
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

      @Script('build')
      noInquiry(): string {
        return 'react build return'
      }
    }

    const pluginFactory = new PluginFactory({
      requireResult: InquiryPlugin
    })
    expect(pluginFactory.getPluginMetaData().inquiries)
      .toStrictEqual([
        {
          'methodName': 'tryInquiry'
        }
      ])

    const instance = pluginFactory.getPluginInstance()

    expect(instance['tryInquiry']()).toStrictEqual([
      {
        type: 'list',
        message: '请选择一个开发语言'
      }
    ])
  })

  test('@Construction 元数据注册', () => {
    class ConstructionPlugin {
      @Construction()
      tryConstruction() {
        return 'foo'
      }

      @Script('build')
      noInquiry(): string {
        return 'react build return'
      }
    }

    const pluginFactory = new PluginFactory({
      requireResult: ConstructionPlugin
    })
    expect(pluginFactory.getPluginMetaData()['constructions'])
      .toStrictEqual([
        {
          'methodName': 'tryConstruction'
        }
      ])

    const instance = pluginFactory.getPluginInstance()

    expect(instance['tryConstruction']()).toStrictEqual('foo')
  })

  test('@Runtime 元数据注册', () => {
    class RuntimePlugin {
      @Runtime()
      runtime() {
        return 'runtime~'
      }
    }

    const pluginFactory = new PluginFactory({
      requireResult: RuntimePlugin
    })
    const meta = pluginFactory.getPluginMetaData()
    expect(meta)
      .toStrictEqual({
        'constructions': [],
        'inquiries': [],
        'name': 'RuntimePlugin',
        'runtime': [
          {
            'methodName': 'runtime'
          }
        ],
        'scripts': []
      })
    const method = meta['runtime'][0]['methodName']
    expect(pluginFactory.getPluginInstance()[method]()).toStrictEqual('runtime~')
  })

  test('exports.xxx=xxx 类型的模块测试', () => {
    const foo = jest.fn()
    const myModule = {
      default:
        class FooPlugin {
          constructor() {
            foo()
          }

          bar() {
            return 'hello world!'
          }
        }
    }
    const pluginFactory = new PluginFactory({
      requireResult: myModule
    })
    expect(foo).toBeCalledTimes(1)

    const pluginInstance = pluginFactory.getPluginInstance()
    expect(pluginInstance['bar']()).toStrictEqual('hello world!')
  })
})
