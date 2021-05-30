/*
 * File: runtimeManager.spec.ts
 * Description: runtimeManager 单元测试
 * Created: 2021-2-23 01:49:17
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { fsMock, PACKAGE_JSON_BASE } from '@attachments/serendipity-public'
import { RuntimeManager } from '../src/runtime-manager'
import { Script } from '../src/decorators'

describe('runtimeManager 测试', () => {
  test('尝试加载本地 package.json', () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        main: 'index.js'
      })
    })

    const rm = new RuntimeManager(f.path)
    expect(rm.appManager.getPackageConfig()).toEqual({
      main: 'index.js'
    })
  })

  test('尝试 @Script 命令执行(plugin 手动传入)', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        main: 'index.js'
      })
    })

    const logger = console.log = jest.fn()
    const rm = new RuntimeManager(f.path)

    class FooPlugin {
      @Script('start')
      start() {
        console.log('hello world')
      }

      @Script('build')
      build() {
        console.log('hello build')
      }
    }

    rm.registerPlugin(FooPlugin)
    await rm.runCommand('start')

    expect(logger).toBeCalledWith('hello world')

    await rm.runCommand('build')
    expect(logger).toBeCalledWith('hello build')
  })

  test('从依赖中注册 plugin', () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        ...PACKAGE_JSON_BASE,
        dependencies: {
          'foo': '1.0.0',
          'serendipity-plugin-react': '1.0.0'
        },
        devDependencies: {
          '@attachments/serendipity-plugin-init': '1.0.0'
        }
      }),
      'node_modules': {
        'serendipity-plugin-react.json': '{"name":"react"}',
        '@attachments': {
          'serendipity-plugin-init.json': '{"name":"init"}'
        }
      }
    })
    const r = new RuntimeManager(f.path)
    // @ts-ignore
    r.getPluginExecutor().registerPlugin = jest.fn((p1, p2) => {
      expect(p1.name).toStrictEqual('serendipity-plugin-react')
      expect(p2.name).toStrictEqual('@attachments/serendipity-plugin-init')
    })

    r.registerPluginsFromPackage()
  })
})
