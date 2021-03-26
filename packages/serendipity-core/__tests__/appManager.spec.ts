/*
 * File: appManager.spec.ts
 * Description: appManager 单元测试
 * Created: 2021-2-16 23:15:16
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import * as path from 'path'
import { generateTempPathInfo } from '@attachments/serendipity-public'
import AppManager from '../src/appManager'

jest.mock('execa')

// eslint-disable-next-line max-lines-per-function
describe('appManager 模块测试', () => {
  const fsHelper = generateTempPathInfo()

  afterAll(() => {
    fsHelper.removeDir()
  })

  test('传入已知的 app/package 等配置，不从文件读取', () => {
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

    const manager = new AppManager(fsHelper.path, appConfig, packageConfig)
    expect(manager.getAppConfig()).toStrictEqual(appConfig)
    expect(manager.getPackageConfig()).toStrictEqual(packageConfig)
  })

  test('从 package 配置中读取正确的插件列表', () => {
    const appConfig = {}
    const packageConfig = {
      'dependencies': {
        '@attachments/serendipity-plugin-babel': '~0.0.12',
        '@attachments/serendipity-plugin-eslint': '~0.0.12',
        '@attachments/serendipity-public': '~0.0.9',
        '@babel/core': '^7.12.10'
      },
      'devDependencies': {
        '@attachments/serendipity-plugin-react': '~0.0.10'
      }
    }
    const manager = new AppManager(fsHelper.path, appConfig, packageConfig)
    expect(manager.getPluginList()).toStrictEqual([
      '@attachments/serendipity-plugin-babel',
      '@attachments/serendipity-plugin-eslint',
      '@attachments/serendipity-plugin-react'
    ])
  })

  test('获取插件模块', () => {
    const appConfig = {}
    const packageConfig = {
      'dependencies': {
        '@attachments/serendipity-plugin-babel': '~0.0.12',
        '@attachments/serendipity-plugin-eslint': '~0.0.12',
        '@attachments/serendipity-public': '~0.0.9'
      }
    }
    const manager = new AppManager(process.cwd(), appConfig, packageConfig)
    const modules = manager.getPluginModules()

    // 只有模块读取成功才会走到这一步
    expect(modules.length).toStrictEqual(2)
  })

  test('读取配置文件，并在配置文件中传递插件 options', () => {
    jest.mock('execa')

    const configFileMockContent = `
    const path = require('path')
    
    module.exports = {
      plugins: [
        {
          name: 'serendipity-plugin-foo',
          options: {
            foo: path.resolve('/foo', 'bar'),
            bar: 'hello world'
          }
        }
      ]
    }`
    const base = fsHelper.resolve('serendipity.js')
    fs.writeFileSync(base, configFileMockContent)
    const am = new AppManager(fsHelper.path, null, {})
    const opt = am.getPluginOptionByName('serendipity-plugin-foo')
    expect(opt).toStrictEqual(
      {
        foo: path.resolve('/foo', 'bar'),
        bar: 'hello world'
      }
    )
  })
  test('写入 App 配置文件测试', async () => {
    const appManager = new AppManager(fsHelper.path, {
      plugins: [
        {
          name: 'serendipity-plugin-foo',
          options: {
            foo: 'foo',
            bar: 'bar'
          }
        }
      ]
    }, {})
    await appManager.writeAppConfig()
    const res = fs.readFileSync(fsHelper.resolve('serendipity.js')).toString()
    expect(res).toStrictEqual('module.exports = {\n' +
      '  "plugins": [\n' +
      '    {\n' +
      '      "name": "serendipity-plugin-foo",\n' +
      '      "options": {\n' +
      '        "foo": "foo",\n' +
      '        "bar": "bar"\n' +
      '      }\n' +
      '    }\n' +
      '  ]\n' +
      '}')
  })

  test('无效的 plugin, 我们将其 require 结果置为 null', () => {
    const appConfig = {}
    const packageConfig = {
      'dependencies': {
        '@attachments/serendipity-plugin-foo': '~0.0.9'
      }
    }
    const manager = new AppManager(process.cwd(), appConfig, packageConfig)
    const modules = manager.getPluginModules()

    // 只有模块读取成功才会走到这一步
    expect(modules.length).toStrictEqual(1)
    expect(modules[0].requireResult).toBeNull()
  })

  test('多次重复声明同一个插件', () => {
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
    const manager = new AppManager(process.cwd(), appConfig, packageConfig)
    const modules = manager.getPluginModules()

    // 只有模块读取成功才会走到这一步
    expect(modules.length).toStrictEqual(1)
    expect(modules[0].options).toStrictEqual({
      foo: 'foo1',
      bar: 'bar1'
    })
  })
})
