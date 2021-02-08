/*
 * File: serviceManager.spec.ts
 * Description: ServiceManager 模块单元测试
 * Created: 2021-2-3 00:14:29
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { PluginModule } from '@attachments/serendipity-public/bin/types/plugin'
import { ServiceModule, ServiceOption } from '@attachments/serendipity-public/bin/types/cliService'
import { serendipityEnv } from '@attachments/serendipity-public'
import ServiceManager from '../src/serviceManager'

describe('serviceManager 模块', () => {
  beforeEach(() => {
    serendipityEnv.setSerendipityDevelopment()
  })

  test('测试 service 模块质询', () => {
    const inquiry = jest.fn(() => {
      return [
        {
          type: 'confirm',
          name: 'foo',
          message: '测试消息',
          default: true
        }
      ]
    })

    const service = jest.fn((opt: ServiceOption) => {
      expect(opt.inquiryResult).toStrictEqual({})
    })

    const serviceModule: ServiceModule = {
      inquiry: inquiry,
      service: service
    }
    const manager = new ServiceManager(process.cwd(), {}, serviceModule)
    manager.setPackageConfig({})
    manager.runServiceInquirer()
    manager.runCreateWorkTasks()
    expect(inquiry).toBeCalledTimes(1)
    expect(service).toBeCalledTimes(1)
  })

  test('测试 plugin 注册', async () => {
    const manager = new ServiceManager('foo', {}, null)
    const plugin1: PluginModule = {
      construction: (options) => {
        options.mergeAppConfig({
          plugins: [
            'foo-plugin'
          ]
        })
      }
    }

    const plugin2: PluginModule = {
      construction: (options) => {
        options.mergeAppConfig({
          plugins: [
            'bar-plugin'
          ]
        })
      }
    }

    manager.registerPlugin('plugin1', plugin1)
    manager.registerPlugin('plugin2', plugin2)
    await manager.runPluginsConstruction()
    expect(manager.getPluginManagers().length).toStrictEqual(2)
    expect(manager.collectAppConfig()).toStrictEqual({
      plugins: [
        'foo-plugin',
        'bar-plugin'
      ]
    })
  })
})