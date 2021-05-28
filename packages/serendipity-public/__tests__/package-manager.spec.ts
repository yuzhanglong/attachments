/*
 * File: packageManager.spec.ts
 * Description: packageManager 测试
 * Created: 2021-2-17 17:47:50
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { PackageManager, fsMock } from '../src'

jest.mock('execa')
const mockedExeca = require('../../../__mocks__/execa')

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
    expect(packageManager.getPackageConfig()).toEqual({
      'license': 'MIT',
      'main': 'index.js',
      'name': 'your-name',
      'version': '1.0.0'
    })

    // @ts-ignore
    expect(packageManager.managerName).toStrictEqual('npm')
  })

  test('用户工作目录下出现 yarn.lock, 我们设置管理工具为 yarn，否则为默认值 npm', () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        'license': 'MIT',
        'main': 'index.js',
        'name': 'your-name',
        'version': '1.0.0'
      }),
      'yarn.lock': 'foo'
    })

    const packageManager = PackageManager.createWithResolve(f.path)
    expect(packageManager.getPackageConfig()).toEqual({
      'license': 'MIT',
      'main': 'index.js',
      'name': 'your-name',
      'version': '1.0.0'
    })

    // @ts-ignore
    expect(packageManager.managerName).toStrictEqual('yarn')
  })

  test('尝试获取当前工作目录下的某个模块', () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        'license': 'MIT',
        'main': 'index.js',
        'name': 'your-name',
        'version': '1.0.0'
      }),
      'node_modules': {
        'foo.json': JSON.stringify({
          a: 1,
          b: 2
        })
      }
    })

    const packageManager = PackageManager.createWithResolve(f.path)

    expect(packageManager.getPackageModule('foo.json'))
      .toStrictEqual({
        a: 1,
        b: 2
      })
  })

  test('安装依赖，但没有传入参数，我们直接返回一个空对象', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        'main': 'index.js'
      })
    })

    const packageManager = PackageManager.createWithResolve(f.path)
    // @ts-ignore
    expect(await packageManager.addAndInstallModule()).toStrictEqual({})
  })

  test('安装依赖，且这个依赖属于本地文件，我们最终执行的是 npm install file: 命令', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        'main': 'index.js'
      })
    })

    const packageManager = PackageManager.createWithResolve(f.path)
    await packageManager.addAndInstallModule({
      name: 'foo',
      localPath: '/usr/foo',
      version: '1.0.0',
      onError: () => {
        return
      }
    })

    expect(mockedExeca.getCommands()).toStrictEqual([
      'npm install file:/usr/foo'
    ])
  })

  test('安装依赖，且这个依赖属于 npm 上的第三方库，我们最终执行的是 npm install xxx 命令', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        'main': 'index.js'
      })
    })

    const packageManager = PackageManager.createWithResolve(f.path)
    await packageManager.addAndInstallModule({
      name: 'foo',
      onError: () => {
        return
      }
    })

    expect(mockedExeca.getCommands()).toStrictEqual([
      'npm install foo'
    ])
  })

  test('安装依赖，指定了版本号', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        'main': 'index.js'
      })
    })

    const packageManager = PackageManager.createWithResolve(f.path)
    await packageManager.addAndInstallModule({
      name: 'foo',
      version: '1.0.0',
      onError: () => {
        return
      }
    })

    expect(mockedExeca.getCommands()).toStrictEqual([
      'npm install foo@1.0.0'
    ])
  })

  test('移除依赖', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        'main': 'index.js'
      })
    })

    const packageManager = PackageManager.createWithResolve(f.path)
    await packageManager.removeDependency('foo')

    expect(mockedExeca.getCommands()).toStrictEqual([
      'npm remove foo'
    ])
  })

  test('安装所有依赖，我们最终执行的是 npm install 命令', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        'main': 'index.js'
      })
    })

    const packageManager = PackageManager.createWithResolve(f.path)
    await packageManager.installDependencies()

    expect(mockedExeca.getCommands()).toStrictEqual([
      'npm install'
    ])
  })

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
