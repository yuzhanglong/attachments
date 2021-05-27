/*
 * File: packageManager.spec.ts
 * Description: packageManager 测试
 * Created: 2021-2-17 17:47:50
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { PackageManager, fsMock } from '../src'

describe('packageManager 测试模块', () => {
  test('在已存在的 npm/yarn 工作目录下初始化 packageManager', () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        'license': 'MIT',
        'main': 'index.js',
        'name': 'your-name',
        'version': '1.0.0'
      })
    })

    const packageManager = PackageManager.createWithResolve(f.path)
    expect(packageManager.getPackageConfig()).toStrictEqual({
      'license': 'MIT',
      'main': 'index.js',
      'name': 'your-name',
      'version': '1.0.0'
    })
  })

  // const mockedExeca = require('../../../__mocks__/execa')
  // test('模块安装字符串生成', () => {
  //   const packageManager = new PackageManager(process.cwd(), 'yarn')
  //   expect(packageManager.getInstallCommand({
  //     name: 'foo',
  //     localPath: '/usr/foo',
  //     version: '1.0.0'
  //   })).toStrictEqual('yarn add file:/usr/foo')
  //
  //   expect(packageManager.getInstallCommand({
  //     name: 'foo',
  //     version: '1.0.0'
  //   })).toStrictEqual('yarn add foo@1.0.0')
  //
  //   expect(packageManager.getInstallCommand({
  //     name: 'foo'
  //   })).toStrictEqual('yarn add foo')
  // })
  //
  // test('尝试安装相关依赖', async () => {
  //   jest.mock('execa')
  //   const pm = new PackageManager('/')
  //   await pm.installDependencies()
  //   expect(mockedExeca.getCommands()).toStrictEqual([
  //     'yarn install'
  //   ])
  // })
  //
  // test('从文件系统读取 package.json(无配置预设)', () => {
  //   fs.writeFileSync(
  //     fsHelper.resolve('package.json'),
  //     JSON.stringify({
  //       name: 'yzl',
  //       version: '1.0.0'
  //     }))
  //   const pm = PackageManager.createWithResolve(path.resolve(fsHelper.path))
  //
  //   expect(pm.getPackageConfig()).toStrictEqual({
  //     'name': 'yzl',
  //     'version': '1.0.0'
  //   })
  // })
  //
  // test('在读取 package.json 配置失败时，将配置值置为空对象 {}', () => {
  //   const pm = PackageManager.createWithResolve(fsHelper.resolve('foo'))
  //   expect(pm.getPackageConfig()).toStrictEqual({
  //     'license': 'MIT',
  //     'main': 'index.js',
  //     'name': 'your-name',
  //     'version': '1.0.0'
  //   })
  // })
  //
  // test('通过名称获取当前管理目录下的模块', () => {
  //   const pm = PackageManager.createWithResolve(process.cwd())
  //   expect(pm.getPackageModule('jest')).toBeTruthy()
  // })
  //
  // test('尝试移除依赖，执行 yarn(npm) remove 命令', async () => {
  //   jest.mock('execa')
  //   const pm = new PackageManager(process.cwd())
  //   await pm.removeDependency('foo')
  //   expect(mockedExeca.getCommands()).toStrictEqual([
  //     'yarn remove foo'
  //   ])
  // })
  //
  // test('安装命令执行失败时，从 onError 回调中获取错误信息', () => {
  //   jest.mock('execa')
  //   const pm = new PackageManager(path.resolve(fsHelper.path))
  //   pm.addAndInstallModule({
  //     name: 'axios',
  //     onError: (e) => {
  //       expect(e).toBeTruthy()
  //     }
  //   })
  //   expect(mockedExeca.getCommands()).toStrictEqual([
  //     'yarn add axios'
  //   ])
  // })
})
