/*
 * File: packageManager.spec.ts
 * Description: packageManager 测试
 * Created: 2021-2-17 17:47:50
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as fs from 'fs'
import { patchRequire } from 'fs-monkey'
import { PackageManager } from '../src'

const mockedExeca = require('../../../__mocks__/execa')

jest.mock('execa')

describe('packageManager 测试模块', () => {
  test('模块安装字符串生成', () => {
    const packageManager = new PackageManager(process.cwd(), 'yarn')
    expect(packageManager.getInstallCommand({
      name: 'foo',
      localPath: '/usr/foo',
      version: '1.0.0'
    })).toStrictEqual('yarn add file:/usr/foo')

    expect(packageManager.getInstallCommand({
      name: 'foo',
      version: '1.0.0'
    })).toStrictEqual('yarn add foo@1.0.0')

    expect(packageManager.getInstallCommand({
      name: 'foo'
    })).toStrictEqual('yarn add foo')
  })

  test('从文件系统中获取 package 配置', () => {
    fs.writeFileSync('/package.json', '{"version": "1.0.0"}')
    patchRequire(fs)
    const pm = PackageManager.createWithResolve('/')
    expect(pm.getPackageConfig()).toStrictEqual({
      'version': '1.0.0'
    })
  })

  test('配置合并', () => {
    const pm = new PackageManager('/')
    pm.mergeIntoCurrent({
      'version': '1.0.0',
      'dependencies': {
        'foo': '1.0.0'
      },
      'devDependencies': {
        'bar': '1.0.0'
      }
    })
    expect(pm.getPackageConfig()).toStrictEqual({
      'version': '1.0.0',
      'dependencies': {
        'foo': '1.0.0'
      },
      'devDependencies': {
        'bar': '1.0.0'
      }
    })
  })

  test('尝试安装相关依赖', async () => {
    const pm = new PackageManager('/')
    await pm.installDependencies()
    expect(mockedExeca.getCommands()).toStrictEqual([
      'yarn install'
    ])
  })
})
