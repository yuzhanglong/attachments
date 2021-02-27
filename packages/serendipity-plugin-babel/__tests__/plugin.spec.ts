/*
 * File: plugin.spec.ts
 * Description: plugin 测试
 * Created: 2021-2-24 00:28:31
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { PluginExecutor, SerendipityPlugin } from '@attachments/serendipity-scripts'
import { AppManager } from '@attachments/serendipity-public'
import { ReactServiceHooks } from '@attachments/serendipity-plugin-react/bin/types/hooks'
import { SyncHook } from 'tapable'
import { generateTempPathInfo } from '@attachments/serendipity-public/bin/utils/testUtils'
import SerendipityBabelPlugin from '../src'

describe('plugin 测试', () => {
  const fsHelper = generateTempPathInfo()

  afterAll(() => {
    fsHelper.removeDir()
  })

  test('构建模式测试', async () => {
    const am = new AppManager(fsHelper.path, {}, {})
    const pm = new PluginExecutor(am)
    pm.registerPluginByConstructor(SerendipityBabelPlugin)
    await pm.executeConstruction()
    expect(am.packageManager.getPackageConfig()).toStrictEqual({
      'babel': {
        'presets': [
          '@babel/preset-react',
          '@babel/preset-typescript'
        ]
      }
    })
  })

  test('runtime 测试', async () => {
    @SerendipityPlugin('serendipity-react-plugin')
    class MockPlugin {
      public reactServiceHooks: ReactServiceHooks = {
        beforeWebpackStart: new SyncHook(['webpackConfig']),
        beforeDevServerStart: new SyncHook(['devServerConfig'])
      }

      mock() {
        this.reactServiceHooks.beforeWebpackStart.call((data) => {
          expect(data.hasOwnProperty('module')).toBeTruthy()
          expect(data.module.rules.length).toStrictEqual(1)
        })
      }
    }

    const pm = new PluginExecutor()
    pm.registerPluginByConstructor(MockPlugin, SerendipityBabelPlugin)
    pm.registerPlugin()
    pm.executeRuntime()
    const target = pm.getPlugins().find(res => res.getPluginMetaName() === 'serendipity-react-plugin')
    expect(target).toBeTruthy()
    const instance = target.getPluginInstance() as MockPlugin
    instance.mock()
  })
})
