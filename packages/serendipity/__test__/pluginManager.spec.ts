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

    const pluginManager = new PluginManager(process.cwd(), 'test-plugin', plugin)

    expect(pluginManager.pluginModule).toStrictEqual(plugin)
    pluginManager.runPluginInquirer()
    pluginManager.runConstruction()
    // 在 construction 中可以获得调用结果
    expect(constructionFn).toBeCalledTimes(1)
    expect(inquiryFn).toBeCalledTimes(1)
    expect(pluginManager.appConfig).toBeUndefined()
    // 开发模式下这个值会被置为 null
    expect(pluginManager.inquiryResult).toBeNull()
  })
})