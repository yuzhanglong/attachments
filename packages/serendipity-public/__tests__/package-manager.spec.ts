/*
 * File: packageManager.spec.ts
 * Description: packageManager 测试
 * Created: 2021-2-17 17:47:50
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as fs from 'fs'
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
    f.clear()
  })

  test('基于选项初始化 manager(不会直接读取文件系统)', () => {
    const m = PackageManager.createWithOptions({
      basePath: '/',
      managerName: 'yarn',
      packageConfig: {
        name: 'yzl',
        age: 20
      }
    })

    expect(m.getPackageConfig()).toEqual({
      name: 'yzl',
      age: 20
    })
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
    f.clear()
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
    f.clear()
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
    f.clear()
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
    f.clear()
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
    f.clear()
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
    f.clear()
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
    f.clear()
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
    f.clear()
  })

  test('尝试写入新的 package.json 文件', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        'license': 'MIT',
        'main': 'index.js',
        'name': 'your-name',
        'version': '1.0.0'
      })
    })

    const packageManager = PackageManager.createWithResolve(f.path)

    packageManager.mergeIntoCurrent({
      'type': 'module'
    })

    expect(packageManager.getPackageConfig()).toEqual({
      'license': 'MIT',
      'main': 'index.js',
      'name': 'your-name',
      'type': 'module',
      'version': '1.0.0'
    })

    await packageManager.writePackageConfig()
    const target = f.resolve('package.json')
    const res = fs.readFileSync(target).toString()
    expect(JSON.parse(res)).toEqual({
      'license': 'MIT',
      'main': 'index.js',
      'name': 'your-name',
      'type': 'module',
      'version': '1.0.0'
    })
    f.clear()
  })

  test('合并package.json, 非依赖相关字段', () => {
    const m = PackageManager.createWithOptions({
      basePath: '/',
      managerName: 'yarn',
      packageConfig: {}
    })

    m.mergeIntoCurrent({
      type: 'module',
      main: 'index.js'
    })

    expect(m.getPackageConfig()).toEqual({
      'main': 'index.js',
      'type': 'module'
    })

    m.mergeIntoCurrent({
      foo: {
        name: 'yzl',
        age: 20
      }
    })

    m.mergeIntoCurrent({
      foo: {
        name: 'yzl2',
        age: 21
      }
    })

    expect(m.getPackageConfig()).toEqual({
      'foo': {
        'age': 21,
        'name': 'yzl2'
      },
      'main': 'index.js',
      'type': 'module'
    })
  })

  test('合并package.json, 传入了 null/undefined 之类的非法值', () => {
    const m = PackageManager.createWithOptions({
      basePath: '/',
      managerName: 'yarn',
      packageConfig: {}
    })

    m.mergeIntoCurrent({
      type: 'module',
      main: 'index.js',
      foo: null
    })

    expect(m.getPackageConfig()['foo']).toBeUndefined()


    m.mergeIntoCurrent({
      bar: null
    }, {
      ignoreNullOrUndefined: false
    })

    expect(m.getPackageConfig()['bar']).toBeNull()
  })

  test('合并package.json, 合并的内容为依赖包相关字段', () => {
    const m = PackageManager.createWithOptions({
      basePath: '/',
      managerName: 'yarn',
      packageConfig: {}
    })

    m.mergeIntoCurrent({
      type: 'module',
      main: 'index.js',
      dependencies: {
        axios: 'latest'
      },
      devDependencies: {
        jest: '^1.2.5'
      }
    })

    m.mergeIntoCurrent({
      dependencies: {
        axios: '^1.2.5'
      },
      devDependencies: {
        jest: 'latest'
      }
    })

    expect(m.getPackageConfig()).toEqual({
      'dependencies': {
        'axios': '^1.2.5'
      },
      'devDependencies': {
        'jest': 'latest'
      },
      'main': 'index.js',
      'type': 'module'
    })
  })

  test('设置 package.json 文件', () => {
    const m = PackageManager.createWithOptions({
      basePath: '/',
      managerName: 'yarn',
      packageConfig: {
        name: 'yzl',
        age: 20
      }
    })

    m.setPackageConfig({})
    expect(m.getPackageConfig()).toEqual({})
  })

  test('package.json 文件不存在，我们需要在命令行中给出提示', () => {
    const f = fsMock({})
    try {
      PackageManager.createWithResolve(f.path)
    } catch (e) {
      expect(e.message).toStrictEqual('package.json 文件不存在！')
    }
  })

  test('安装依赖的过程中抛出异常，且没有设置回调函数', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        'main': 'index.js'
      })
    })

    const packageManager = PackageManager.createWithResolve(f.path)
    try {
      await packageManager.addAndInstallModule({
        name: 'foo',
        version: '1.0.0'
      })
    } catch (e) {
      expect(e.message.startsWith('Error: Cannot find module')).toBeTruthy()
    }
  })

  test('在调用 getPackageConfig() 时，如果某个键的值为空对象，我们删除之', () => {
    const m = PackageManager.createWithOptions({
      basePath: '/',
      managerName: 'yarn',
      packageConfig: {
        // 不会处理
        name: undefined,
        // 不会处理
        age: null,
        hobby: {}
      }
    })

    expect(m.getPackageConfig()).toEqual({
      'age': null,
      'name': undefined
    })
  })
})
