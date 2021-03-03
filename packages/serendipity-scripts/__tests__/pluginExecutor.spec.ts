/*
 * File: pluginExecutor.spec.ts
 * Description: plugin 执行器单元测试
 * Created: 2021-2-20 18:33:52
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import { SyncHook } from 'tapable'
import { generateTempPathInfo } from '@attachments/serendipity-public/bin/utils/testUtils'
import { Construction, Runtime, Script, Inquiry, SerendipityPlugin } from '../src'
import PluginExecutor from '../src/core/pluginExecutor'
import { ConstructionOptions, ScriptOptions } from '../src/types/pluginExecute'


jest.mock('inquirer')

// eslint-disable-next-line max-lines-per-function
describe('plugin 执行器', () => {
  const fsHelper = generateTempPathInfo()

  afterAll(() => {
    fsHelper.removeDir()
  })

  test('多个 @script', () => {
    const beforeCallback = jest.fn()

    const executeCallback = jest.fn()

    const afterCallback = jest.fn()

    class FooPlugin {
      @Script('start')
      start(options: ScriptOptions) {
        options.scriptHooks.beforeScriptExecute.tap('before', beforeCallback)
        options.scriptHooks.afterExecute.tap('after', afterCallback)
        options.scriptHooks.scriptExecute.tap('execute', executeCallback)
      }

      @Script('build')
      build(options: ScriptOptions) {
        options.scriptHooks.beforeScriptExecute.tap('before', beforeCallback)
        options.scriptHooks.afterExecute.tap('after', afterCallback)
        options.scriptHooks.scriptExecute.tap('execute', executeCallback)
      }
    }

    const pluginExecutor = new PluginExecutor()

    pluginExecutor.registerPluginByConstructor(FooPlugin)

    pluginExecutor.executeScript('start')

    // 即使我们有两个 script 注解，也应该只执行一次
    expect(beforeCallback).toBeCalledTimes(1)
    expect(afterCallback).toBeCalledTimes(1)
    expect(executeCallback).toBeCalledTimes(1)
  })

  test('多个 plugin tap 协作', () => {
    class PluginOne {
      public testArray = []
      public myHook = {
        pushTestArray: new SyncHook(['testArray'])
      }
      public executeCallback = jest.fn(() => {
        this.testArray.push('yzl')
        this.myHook.pushTestArray.call(this.testArray)
      })


      @Script('start')
      build(options: ScriptOptions) {
        options.scriptHooks.scriptExecute.tap('execute', this.executeCallback)
      }
    }

    class PluginTwo {
      @Runtime()
      tapPluginOne(options: ScriptOptions) {
        const pluginOne = options.matchPlugin('PluginOne').getPluginInstance() as PluginOne
        pluginOne.myHook.pushTestArray.tap('foo', (arr) => {
          if (Array.isArray(arr)) {
            arr.push('20', 'programmer')
          }
        })
      }
    }

    const pluginExecutor = new PluginExecutor()

    pluginExecutor.registerPluginByConstructor(PluginOne, PluginTwo)
    pluginExecutor.executeScript('start')
    const pluginOneInstance = pluginExecutor.getPlugins()[0].getPluginInstance() as PluginOne
    expect(pluginOneInstance.testArray).toStrictEqual([
      'yzl',
      '20',
      'programmer'
    ])

    expect(pluginOneInstance.executeCallback).toBeCalledTimes(1)
  })

  test('plugin constructions 流程执行', async () => {
    @SerendipityPlugin('hello-world')
    class HelloWorldPlugin {
      @Construction()
      async foo(options: ConstructionOptions) {
        // 模板写入
        await options.renderTemplate(
          'base',
          {},
          '/target'
        )

        expect(options.inquiryResult)
          .toStrictEqual({
            eslintSupport: true
          })

        // 通过原型链找到构造函数，期望是 HelloWorldPlugin
        const pluginInstance = options.matchPlugin('hello-world').getPluginInstance()
        const constructor = Object.getPrototypeOf(pluginInstance).constructor
        expect(constructor).toStrictEqual(HelloWorldPlugin)
      }

      @Inquiry()
      myInquiry() {
        return [
          {
            type: 'confirm',
            name: 'eslintSupport',
            message: '增加 eslint 支持',
            default: true
          }
        ]
      }
    }

    // 文件初始化
    fs.mkdirSync(fsHelper.resolve('templates'))
    fs.mkdirSync(fsHelper.resolve('templates/base'))
    fs.writeFileSync(fsHelper.resolve('templates/base/bar'), 'hello world bar')
    fs.writeFileSync(fsHelper.resolve('templates/base/foo'), 'hello world foo')


    const executor = new PluginExecutor()
    executor.registerPluginByConstructor(HelloWorldPlugin)

    await executor.executeConstruction()

    expect(fs.existsSync(fsHelper.resolve('templates/base/foo'))).toBeTruthy()
    expect(fs.existsSync(fsHelper.resolve('templates/base/bar'))).toBeTruthy()
  })

  // test('质询的默认值覆盖，用户不会收到这些质询，且最终结果包含覆盖的值', async () => {
  //   const executor = new PluginExecutor()
  //
  //   const testConstructionFn = jest.fn((options: ConstructionOptions) => {
  //     expect(options.inquiryResult).toStrictEqual({
  //       'bar': 'I love TypeScript!',
  //       'baz': 'I am 20 years old!',
  //       'foo': 'I love JavaScript!',
  //       'quz': 'I love coding!'
  //     })
  //   })
  //
  //   class TestInquiryPlugin {
  //     @Construction()
  //     myConstruction(options: ConstructionOptions) {
  //       testConstructionFn(options)
  //     }
  //
  //     @Inquiry()
  //     myInquiry() {
  //       return [
  //         {
  //           type: 'text',
  //           name: 'foo',
  //           message: '111',
  //           default: 'hello world!'
  //         },
  //         {
  //           type: 'text',
  //           name: 'bar',
  //           message: '222',
  //           default: 'I love programming!'
  //         },
  //         {
  //           type: 'text',
  //           name: 'baz',
  //           message: '333',
  //           default: 'I am 20 years old!'
  //         }
  //       ]
  //     }
  //   }
  //
  //   executor.registerPluginByConstructor(TestInquiryPlugin)
  //   await executor.executeConstruction({
  //     foo: 'I love JavaScript!',
  //     bar: 'I love TypeScript!',
  //     quz: 'I love coding!'
  //   })
  //   expect(testConstructionFn).toBeCalledTimes(1)
  // })
})
