/*
 * File: serviceManager.spec.ts
 * Description: ServiceManager 模块单元测试
 * Created: 2021-2-3 00:14:29
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import ServiceManager from '../src/serviceManager'
import { PluginModule } from '@attachments/serendipity-public/bin/types/plugin'

describe('serviceManager 模块', () => {
  test('测试 app 配置文件收集', () => {
    const manager = new ServiceManager('foo', {}, null)
    const plugin1: PluginModule = {
      template: (options) => {
        options.mergeAppConfig({
          plugins: [
            'foo-plugin'
          ]
        })
      }
    }
    const plugin2: PluginModule = {
      template: (options) => {
        options.mergeAppConfig({
          plugins: [
            'bar-plugin'
          ]
        })
      }
    }

    manager.registerPlugin('1', plugin1)
    manager.registerPlugin('1', plugin2)
    manager.runPluginsTemplate()
    expect(manager.getPluginManagers().length).toStrictEqual(2)
    expect(manager.collectAppConfig()).toStrictEqual({
      plugins: [
        'foo-plugin',
        'bar-plugin'
      ]
    })
  })
})