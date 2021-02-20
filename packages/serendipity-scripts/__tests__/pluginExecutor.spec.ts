/*
 * File: pluginExecutor.spec.ts
 * Description: plugin 执行器单元测试
 * Created: 2021-2-20 18:33:52
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { SyncHook } from 'tapable'
import { Runtime, Script } from '../src/core/decorators'
import PluginExecutor from '../src/core/pluginExecutor'
import { ScriptOptions } from '../src/types/pluginExecute'

describe('plugin 执行器', () => {
  test('多个 @script 下，只执行第一个', () => {
    const beforeCallback = jest.fn()

    const executeCallback = jest.fn()

    const afterCallback = jest.fn()

    class FooPlugin {
      @Script('start')
      start(options: ScriptOptions) {
        options.hooks.beforeScriptExecute.tap('before', beforeCallback)
        options.hooks.afterExecute.tap('after', afterCallback)
        options.hooks.scriptExecute.tap('execute', executeCallback)
      }

      @Script('build')
      build(options: ScriptOptions) {
        options.hooks.beforeScriptExecute.tap('before', beforeCallback)
        options.hooks.afterExecute.tap('after', afterCallback)
        options.hooks.scriptExecute.tap('execute', executeCallback)
      }
    }

    const pluginExecutor = new PluginExecutor()

    pluginExecutor.registerPlugin(FooPlugin)

    pluginExecutor.runScript('start')

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
        options.hooks.scriptExecute.tap('execute', this.executeCallback)
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
    pluginExecutor.runScript('start')
    const pluginOneInstance: PluginOne = pluginExecutor.getPlugins()[0].getPluginInstance()
    expect(pluginOneInstance.testArray).toStrictEqual([
      'yzl',
      '20',
      'programmer'
    ])
    expect(pluginOneInstance.executeCallback).toBeCalledTimes(1)
  })
})