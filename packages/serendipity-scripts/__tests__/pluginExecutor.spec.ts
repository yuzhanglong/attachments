/*
 * File: pluginExecutor.spec.ts
 * Description: plugin 执行器单元测试
 * Created: 2021-2-20 18:33:52
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import { SyncHook } from 'tapable'
import { Construction, Runtime, Script } from '../src'
import PluginExecutor from '../src/core/pluginExecutor'
import { ConstructionOptions, ScriptOptions } from '../src/types/pluginExecute'
import { Inquiry, SerendipityPlugin } from '../bin'

jest.mock('inquirer')
jest.mock('fs')

// eslint-disable-next-line max-lines-per-function
describe('plugin 执行器', () => {
  test('多个 @script 下，只执行第一个', () => {
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

    pluginExecutor.registerPlugin(FooPlugin)

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
        const pluginOne: PluginOne = options.matchPlugin('PluginOne').getPluginInstance()
        pluginOne.myHook.pushTestArray.tap('foo', (arr) => {
          if (Array.isArray(arr)) {
            arr.push('20', 'programmer')
          }
        })
      }
    }

    const pluginExecutor = new PluginExecutor()

    pluginExecutor.registerPlugin(PluginOne, PluginTwo)
    pluginExecutor.executeScript('start')
    const pluginOneInstance: PluginOne = pluginExecutor.getPlugins()[0].getPluginInstance()
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
          '/base',
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
    fs.mkdirSync('/target')
    fs.mkdirSync('/base')
    fs.writeFileSync('/base/bar', 'hello world bar')
    fs.writeFileSync('/base/foo', 'hello world foo')


    const executor = new PluginExecutor()
    executor.registerPlugin(HelloWorldPlugin)

    await executor.executeConstruction()

    expect(fs.existsSync('/target/bar')).toBeTruthy()
    expect(fs.existsSync('/target/foo')).toBeTruthy()
  })
})