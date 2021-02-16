/*
 * File: pluginManager.spec.ts
 * Description: 插件管理类测试模块
 * Created: 2021-2-8 00:15:26
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { PluginConstructionOptions, PluginModule } from '@attachments/serendipity-public/bin/types/plugin'
import { serendipityEnv } from '@attachments/serendipity-public'
import PluginManager from '../src/pluginManager'

// eslint-disable-next-line max-lines-per-function
describe('PluginManager 测试', () => {
  beforeEach(() => {
    serendipityEnv.setSerendipityDevelopment()
  })

  test('plugin 质询测试', () => {
    const inquiryFn = jest.fn(() => {
      return [
        {
          type: 'confirm',
          name: 'foo',
          message: '测试消息',
          default: true
        }
      ]
    })

    const constructionFn = jest.fn((option: PluginConstructionOptions) => {
      expect(option.inquiryResult).toBeNull()
    })
    const plugin: PluginModule = {
      inquiry: inquiryFn,
      construction: constructionFn
    }

    const pluginManager = new PluginManager(process.cwd(), 'test-plugin', plugin, {})

    expect(pluginManager.pluginModule).toStrictEqual(plugin)
    pluginManager.runPluginInquirer()
    pluginManager.runConstruction()
    // 在 construction 中可以获得调用结果
    expect(constructionFn).toBeCalledTimes(1)
    expect(inquiryFn).toBeCalledTimes(1)
    expect(pluginManager.appManager.getAppConfig()).toStrictEqual({})
    // 开发模式下这个值会被置为 null
    expect(pluginManager.inquiryResult).toBeNull()
  })

  test('plugin 配置合并', () => {
    const constructionFn = jest.fn((option: PluginConstructionOptions) => {
      option.mergePackageConfig({
        plugins: [
          'foo-plugin',
          'bar-plugin'
        ]
      })

      option.mergePackageConfig({
        plugins: [
          'foo2-plugin',
          'bar1-plugin'
        ]
      })
    })
    const plugin: PluginModule = {
      construction: constructionFn
    }
    const pluginManager = new PluginManager(process.cwd(), 'test-plugin', plugin)
    pluginManager.runConstruction()
    expect(constructionFn).toBeCalledTimes(1)
    expect(pluginManager.getPackageManager().getPackageConfig()).toStrictEqual({
      'plugins': {
        '0': 'foo2-plugin',
        '1': 'bar1-plugin'
      }
    })
  })

  test('package 配置合并', () => {
    const constructionFn = jest.fn((option: PluginConstructionOptions) => {
      option.mergePackageConfig({
        foo: 'foo'
      })

      option.mergePackageConfig({
        foo: 'foo2',
        bar: {
          bar: '111',
          baz: '222'
        }
      })
    })
    const plugin: PluginModule = {
      construction: constructionFn
    }
    const pluginManager = new PluginManager('', 'test-plugin', plugin)
    pluginManager.runConstruction()
    expect(constructionFn).toBeCalledTimes(1)
    expect(pluginManager.getPackageManager().getPackageConfig()).toStrictEqual({
      'bar': {
        'bar': '111',
        'baz': '222'
      },
      'foo': 'foo'
    })
  })
})