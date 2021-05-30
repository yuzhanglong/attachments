/*
 * File: container.spec.ts
 * Description: container 测试
 * Created: 2021-2-19 23:49:27
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { Construction, Inquiry, Runtime, Script, SerendipityPlugin } from '@attachments/serendipity-core'
import { PluginWrapper } from '../src/plugin-wrapper'
import { PLUGIN_SCRIPT_META_KEY } from '../src/common'

describe('plugin wrapper 测试', () => {
  test('初始化 plugin 实例，并且 require 的结果是一个含有 default export 的对象', () => {
    const foo = jest.fn()
    const myModule = {
      default: class FooPlugin {
        constructor({ name, age }) {
          foo(name, age)
        }

        bar() {
          return 'hello world!'
        }
      }
    }

    const pluginFactory = new PluginWrapper({
      requireResult: myModule,
      options: {
        name: 'yzl',
        age: 20
      }
    })

    expect(foo).toBeCalledWith('yzl', 20)

    const pluginInstance = pluginFactory.getPluginInstance()
    expect(pluginInstance['bar']()).toStrictEqual('hello world!')
  })

  test('初始化 plugin 实例，并且 require 的结果是一个 class', () => {
    const foo = jest.fn()
    const myModule = class FooPlugin {
      constructor({ name, age }) {
        foo(name, age)
      }

      bar() {
        return 'hello world!'
      }
    }

    const pluginFactory = new PluginWrapper({
      requireResult: myModule,
      options: {
        name: 'yzl',
        age: 20
      }
    })

    expect(foo).toBeCalledWith('yzl', 20)

    const pluginInstance = pluginFactory.getPluginInstance()
    expect(pluginInstance['bar']()).toStrictEqual('hello world!')
  })

  test('Plugin 自定义传递参数', () => {
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

    new PluginWrapper({
      requireResult: ParamPlugin,
      options: {
        foo: 'hello',
        bar: 'world'
      }
    })
    expect(callFn).toBeCalledTimes(1)
  })

  test('获取 plugin 模块基本信息', () => {
    @SerendipityPlugin('FooPlugin')
    class FooPlugin {
      // hello world!
    }

    const pluginFactory = new PluginWrapper({
      requireResult: FooPlugin,
      name: 'serendipity-plugin-react',
      absolutePath: '/home'
    })
    expect(pluginFactory.getPluginModuleName()).toStrictEqual('serendipity-plugin-react')
    expect(pluginFactory.getAbsolutePath()).toStrictEqual('/home')
  })

  test('尝试通过 metaKey 匹配 plugin 的 methods', () => {
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

    const pluginWrapper = new PluginWrapper({
      requireResult: FooPlugin
    })

    const methodNames = pluginWrapper.getPluginMethodsByMetaKey(PLUGIN_SCRIPT_META_KEY)
    expect(methodNames).toStrictEqual([
      {
        'metaResult': 'start',
        'methodName': 'reactStart'
      },
      {
        'metaResult': 'build',
        'methodName': 'reactBuild'
      }
    ])
  })

  test('测试 获取 plugin 名称，即@SerendipityPlugin 元数据', () => {
    @SerendipityPlugin('FooPlugin')
    class FooPlugin {
      // hello world!
    }

    const pluginFactory = new PluginWrapper({
      requireResult: FooPlugin
    })
    expect(pluginFactory.getPluginMetaName()).toStrictEqual('FooPlugin')
  })

  test('尝试执行 Meta Methods', async () => {
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

    const pluginWrapper = new PluginWrapper({
      requireResult: FooPlugin
    })

    const rets = await pluginWrapper.executeMetaMethods(PLUGIN_SCRIPT_META_KEY)

    expect(rets).toStrictEqual([
      'react start return',
      'react build return'
    ])
  })

  test('尝试执行 @Script Methods, 当有多个 script 注解时，我们只执行第一个(按方法定义顺序)', async () => {
    const s1 = jest.fn()
    const s2 = jest.fn()

    class FooPlugin {
      @Script('start')
      b(options: any) {
        s1(options)
      }

      @Script('start')
      a(options: any) {
        s2(options)
      }

      @Script('build')
      reactBuild() {
        return
      }

      foo(): string {
        return 'foo'
      }
    }

    const pluginWrapper = new PluginWrapper({
      requireResult: FooPlugin
    })

    await pluginWrapper.executeScript('start', {
      name: 'yzl',
      age: 20
    })

    expect(s1).toBeCalledWith({
      name: 'yzl',
      age: 20
    })
    expect(s2).toBeCalledTimes(0)
  })

  test('尝试执行 @Runtime Methods', async () => {
    const s1 = jest.fn()
    const s2 = jest.fn()

    class FooPlugin {
      @Runtime()
      a() {
        s1()
      }

      @Runtime()
      b() {
        s2()
      }
    }

    const pluginWrapper = new PluginWrapper({
      requireResult: FooPlugin
    })

    await pluginWrapper.executeRuntime()
    expect(s1).toBeCalled()
    expect(s2).toBeCalled()
  })

  test('尝试执行 @Construction Methods', async () => {
    const s1 = jest.fn()
    const s2 = jest.fn()

    class FooPlugin {
      @Construction()
      a() {
        s1()
      }

      @Construction()
      b() {
        s2()
      }
    }

    const pluginWrapper = new PluginWrapper({
      requireResult: FooPlugin
    })

    await pluginWrapper.executeConstruction()
    expect(s1).toBeCalled()
    expect(s2).toBeCalled()
  })

  test('尝试执行 @Inquiry Methods', async () => {
    class InquiryPlugin {
      @Inquiry()
      tryInquiry() {
        return [
          {
            type: 'list',
            message: '请选择一个开发语言',
            name: 'language',
            choices: [
              'JavaScript',
              'TypeScript'
            ],
            default: 'JavaScript'
          }
        ]
      }
    }

    const pluginFactory = new PluginWrapper({
      requireResult: InquiryPlugin
    })

    const res = await pluginFactory.executeInquiry({})
    expect(res).toStrictEqual({
      'language': 'JavaScript'
    })
  })

  test('尝试执行 @Inquiry Methods, 插件被打上了多个 Inquiry 注解', async () => {
    class InquiryPlugin {
      @Inquiry()
      tryInquiry() {
        return [
          {
            type: 'list',
            message: '请选择一个开发语言',
            name: 'language',
            choices: [
              'JavaScript',
              'TypeScript'
            ],
            default: 'JavaScript'
          }
        ]
      }

      @Inquiry()
      tryInquiry2() {
        return [
          {
            type: 'list',
            message: '你喜欢 JavaScript 吗',
            name: 'isLike',
            choices: [
              'yes',
              'no'
            ],
            default: 'yes'
          }
        ]
      }
    }

    const pluginFactory = new PluginWrapper({
      requireResult: InquiryPlugin
    })

    const res = await pluginFactory.executeInquiry({})
    expect(res).toStrictEqual({
      'isLike': 'yes',
      'language': 'JavaScript'
    })
  })

  test('尝试执行 @Inquiry Methods, 且传入了覆盖质询的参数', async () => {
    class InquiryPlugin {
      @Inquiry()
      tryInquiry() {
        return [
          {
            type: 'list',
            message: '请选择一个开发语言',
            name: 'language',
            choices: [
              'JavaScript',
              'TypeScript'
            ],
            default: 'JavaScript'
          }
        ]
      }
    }

    const pluginFactory = new PluginWrapper({
      requireResult: InquiryPlugin
    })

    const res = await pluginFactory.executeInquiry({
      name: 'yzl',
      language: 'TypeScript'
    })
    expect(res).toStrictEqual({
      'language': 'TypeScript',
      'name': 'yzl'
    })
  })
})
