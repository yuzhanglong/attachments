/*
 * File: appManager.spec.ts
 * Description: appManager 单元测试
 * Created: 2021-2-16 23:15:16
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { fsMock, PACKAGE_JSON_BASE } from '@attachments/serendipity-public'
import { AppManager } from '../src/app-manager'

jest.mock('execa')

describe('appManager 模块测试', () => {
  test('传入已知的 app/package 等配置，不从文件读取', () => {
    const f = fsMock({})
    const appConfig = {}
    const packageConfig = {
      'scripts': {
        'lint': 'eslint --ext .ts --max-warnings 0 packages/',
        'test': 'jest',
        'lerna:link': 'lerna bootstrap',
        'lerna:clean': 'lerna clean',
        'lerna:build': 'lerna run build'
      }
    }

    const manager = AppManager.createAppManager({
      basePath: f.path,
      appConfig: appConfig,
      packageConfig: packageConfig
    })

    expect(manager.getAppConfig()).toStrictEqual(appConfig)
    expect(manager.getPackageConfig()).toEqual(packageConfig)
  })

  test('基于已经存在的项目初始化 AppManager', () => {
    const f = fsMock({
      'package.json': JSON.stringify(PACKAGE_JSON_BASE),
      'serendipity.js': 'module.exports = {}'
    })
    const m = AppManager.createWithResolve(f.path)
    expect(m.getAppConfig()).toStrictEqual({})

    expect(m.getPackageConfig()).toEqual({
      'license': 'MIT',
      'main': 'index.js',
      'name': 'your-name',
      'version': '1.0.0'
    })

    expect(m.getBasePath()).toStrictEqual(f.path)
  })

  test('基于 getPluginModules, 我们可以从依赖表中查找所有脚手架插件', () => {
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
    const m = AppManager.createWithResolve(f.path)

    expect(m.getPluginList()).toStrictEqual([
      'serendipity-plugin-react',
      '@attachments/serendipity-plugin-init'
    ])
    expect(m.getPluginModules().map(res => res.requireResult))
      .toStrictEqual([
        { 'name': 'react' },
        { 'name': 'init' }
      ])
  })

  test('plugin 模块读取失败, 我们不会阻断程序的执行，但模块记录会被记为 null', () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        ...PACKAGE_JSON_BASE,
        dependencies: {
          'serendipity-plugin-react': '1.0.0'
        },
        devDependencies: {
          '@attachments/serendipity-plugin-init': '1.0.0'
        }
      })
    })
    const m = AppManager.createWithResolve(f.path)

    const moduleRequireInfo = m.getPluginModules().map(res => res.requireResult)
    expect(moduleRequireInfo).toStrictEqual([null, null])
  })

  test('在 app 配置文件中多次声明同一个插件的 option, 我们只取第一个配置项', () => {
    const appConfig = {
      plugins: [
        {
          name: '@attachments/serendipity-plugin-init',
          options: {
            foo: 'foo1',
            bar: 'bar1'
          }
        },
        {
          name: '@attachments/serendipity-plugin-init',
          options: {
            foo: 'foo2',
            bar: 'bar2'
          }
        }
      ]
    }
    const packageConfig = {
      'dependencies': {
        '@attachments/serendipity-plugin-init': '~0.0.9'
      }
    }
    const m = AppManager.createAppManager({
      appConfig: appConfig,
      packageConfig: packageConfig,
      basePath: '/'
    })

    expect(m.getPluginOptionByName('@attachments/serendipity-plugin-init'))
      .toStrictEqual({
        'bar': 'bar1',
        'foo': 'foo1'
      })
  })
})
