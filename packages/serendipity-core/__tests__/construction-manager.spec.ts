/*
 * File: constructionManager.spec.ts
 * Description: ConstructionManager 模块单元测试
 * Created: 2021-2-21 14:00:51
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as fs from 'fs'
import { fsMock } from '@attachments/serendipity-public'
import { ConstructionManager } from '../src'

const mockedExeca = require('../../../__mocks__/execa')

jest.mock('execa')

describe('test constructionManager 模块', () => {
  test('constructionManager 的初始化', () => {
    const f = fsMock({})
    const cm = new ConstructionManager(f.path)
    // @ts-ignore
    expect(cm.basePath).toStrictEqual(f.path)
  })

  test('测试默认 app 配置的写入', async () => {
    const f = fsMock({})
    const cm = new ConstructionManager(f.path)
    await cm.writeAppConfig()
    const data = fs.readFileSync(f.resolve('serendipity.js')).toString()
    expect(data).toStrictEqual('module.exports = {}')
  })

  test('测试 git 的初始化', async () => {
    const f = fsMock({})
    const cm = new ConstructionManager(f.path)
    await cm.initGit('foo')
    expect(mockedExeca.getCommands()).toStrictEqual([
      'git init',
      'git add -A',
      'git commit -m foo --no-verify'
    ])
  })

  test('基于 preset 安装 plugins', async () => {
    const f = fsMock({})
    const cm = new ConstructionManager(f.path)
    await cm.installPluginsFromPresets({
      plugins: [
        {
          name: '@serendipity-plugin-bar'
        },
        {
          name: '@serendipity-plugin-foo',
          path: '/my/dir/path'
        },
        {
          name: '@serendipity-plugin-baz',
          version: '1.0'
        }
      ]
    })

    // @ts-ignore
    expect(cm.appManager.packageManager.getPackageConfig())
      .toEqual({
        'dependencies': {
          '@serendipity-plugin-bar': 'latest',
          '@serendipity-plugin-baz': '1.0',
          '@serendipity-plugin-foo': '/my/dir/path'
        },
        'license': 'MIT',
        'main': 'index.js',
        'name': 'serendipity-project',
        'version': '1.0.0'
      })

    expect(mockedExeca.getCommands()).toStrictEqual([
      'npm install'
    ])
  })

  test('测试执行 plugin 构建流程', async () => {
    const f = fsMock({})
    const cm = new ConstructionManager(f.path)
    await cm.installPluginsFromPresets({
      plugins: [
        {
          name: '@serendipity-plugin-bar'
        },
        {
          name: '@serendipity-plugin-foo',
          path: '/my/dir/path'
        },
        {
          name: '@serendipity-plugin-baz',
          version: '1.0'
        }
      ]
    })

    await cm.runPluginConstruction(['@serendipity-plugin-bar'])
    await cm.runPluginConstruction()

    expect(mockedExeca.getCommands()).toStrictEqual([
      'npm install'
    ])
  })

  test('测试 plugin 删除', async () => {
    const f = fsMock({})
    const cm = new ConstructionManager(f.path)
    await cm.removePlugin('foo', 'bar')
    expect(mockedExeca.getCommands()).toStrictEqual([
      'npm remove foo',
      'npm remove bar'
    ])
  })

  test('测试 plugin 的安装', async () => {
    const f = fsMock({})
    const cm = new ConstructionManager(f.path)
    await cm.installPlugin('foo', '1.0')
    // @ts-ignore
    expect(cm.appManager.packageManager.getPackageConfig()['dependencies'])
      .toEqual( {
        'foo': '1.0'
      })

    expect(mockedExeca.getCommands()).toStrictEqual([
      'npm install'
    ])
  })
})
