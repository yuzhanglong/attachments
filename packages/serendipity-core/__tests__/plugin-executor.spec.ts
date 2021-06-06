/*
 * File: pluginExecutor.spec.ts
 * Description: plugin 执行器单元测试
 * Created: 2021-2-20 18:33:52
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import { SyncHook } from 'tapable'
import { fsMock } from '@attachments/serendipity-public'
import { Construction, SerendipityPlugin, Runtime, Inquiry, Script } from '../src/decorators'
import { PluginsExecutor } from '../src/plugins-executor'
import { ConstructionOptions, ScriptOptions } from '../src/types'


jest.mock('inquirer')

describe('plugin 执行器', () => {
  test('基于 tappable 实现多个 plugin 的协作', () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        main: 'index.js'
      })
    })

    class PluginOne {
      public testArray = ['yzl', '20']
      public myHook = {
        pushTestArray: new SyncHook(['testArray'])
      }

      public execute() {
        this.myHook.pushTestArray.call(this.testArray)
      }
    }

    class PluginTwo {
      @Runtime()
      tapPluginOne(options: ScriptOptions) {
        const pluginOne = options.matchPlugin('PluginOne').getPluginInstance() as PluginOne
        pluginOne.myHook.pushTestArray.tap('foo', (arr) => {
          if (Array.isArray(arr)) {
            arr.push('20', 'programmer')
          }
        })
      }
    }

    const pluginExecutor = new PluginsExecutor(undefined, f.path)

    pluginExecutor.registerPluginByConstructor(PluginTwo, PluginOne)
    const pluginOneInstance = pluginExecutor.getPlugins()[1].getPluginInstance() as PluginOne
    pluginExecutor.executeRuntime()
    pluginOneInstance.execute()
    expect(pluginOneInstance.testArray).toStrictEqual(['yzl', '20', '20', 'programmer'])
  })

  test('plugin constructions 流程执行', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        main: 'index.js'
      })
    })

    @SerendipityPlugin('hello-world')
    class HelloWorldPlugin {
      @Construction()
      async foo(options: ConstructionOptions) {
        expect(options.inquiryResult)
          .toStrictEqual({
            eslintSupport: true
          })
      }

      @Inquiry()
      myInquiry() {
        return [
          {
            type: 'confirm',
            name: 'eslintSupport',
            message: '增加 eslint 支持',
            default: true
          }
        ]
      }
    }

    const executor = new PluginsExecutor(undefined, f.path)
    executor.registerPluginByConstructor(HelloWorldPlugin)
    await executor.executeConstruction()
  })

  test('测试质询的默认值覆盖，用户不会收到这些质询，且最终结果包含覆盖的值', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        main: 'index.js'
      })
    })

    const executor = new PluginsExecutor(undefined, f.path)

    const testConstructionFn = jest.fn((options: ConstructionOptions) => {
      expect(options.inquiryResult).toStrictEqual({
        'bar': 'I love TypeScript!',
        'baz': 'I am 20 years old!',
        'foo': 'I love JavaScript!',
        'quz': 'I love coding!'
      })
    })

    class TestInquiryPlugin {
      @Construction()
      myConstruction(options: ConstructionOptions) {
        testConstructionFn(options)
      }

      @Inquiry()
      myInquiry() {
        return [
          {
            type: 'text',
            name: 'foo',
            message: '111',
            default: 'hello world!'
          },
          {
            type: 'text',
            name: 'bar',
            message: '222',
            default: 'I love programming!'
          },
          {
            type: 'text',
            name: 'baz',
            message: '333',
            default: 'I am 20 years old!'
          }
        ]
      }
    }

    executor.registerPlugin({
      requireResult: TestInquiryPlugin,
      name: 'testPlugin'
    })
    await executor.executeConstruction({
      plugins: [
        {
          name: 'testPlugin',
          overrideInquiries: {
            'bar': 'I love TypeScript!',
            'foo': 'I love JavaScript!',
            'quz': 'I love coding!'
          }
        }
      ]
    })
    expect(testConstructionFn).toBeCalledTimes(1)
  })

  test('测试 script 执行(单个插件)', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        main: 'index.js'
      })
    })

    const buildFn = jest.fn()
    const startFn = jest.fn()
    // 在单个插件中，如果多个 script 相同，
    // 我们只执行第一个函数的代码，下面的 failedStartFn 不会被执行
    const failedStartFn = jest.fn()

    @SerendipityPlugin('hello-world')
    class HelloWorldPlugin {
      @Script('start')
      s1() {
        startFn()
      }

      @Script('start')
      s2() {
        failedStartFn()
      }

      @Script('build')
      s3() {
        buildFn()
      }
    }

    const executor = new PluginsExecutor(undefined, f.path)
    executor.registerPluginByConstructor(HelloWorldPlugin)
    await executor.executeScript('start')

    expect(buildFn).toBeCalledTimes(0)
    expect(startFn).toBeCalledTimes(1)
    expect(failedStartFn).toBeCalledTimes(0)
  })

  test('测试 script(多个插件)', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        main: 'index.js'
      })
    })

    const startFn1 = jest.fn()
    const startFn2 = jest.fn()

    class HelloWorldPlugin {
      @Script('start')
      s1() {
        startFn1()
      }
    }

    class HelloWorldPlugin2 {
      @Script('start')
      s1() {
        startFn2()
      }
    }

    const executor = new PluginsExecutor(undefined, f.path)
    executor.registerPluginByConstructor(HelloWorldPlugin, HelloWorldPlugin2)
    await executor.executeScript('start')
    expect(startFn1).toBeCalledTimes(1)
    expect(startFn2).toBeCalledTimes(0)
  })

  test('测试 script 脚本的执行入口和 serendipity-scripts 依赖正确写入 package.json', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        main: 'index.js'
      })
    })

    class HelloWorldPlugin {
      @Script('start')
      start() {
        return
      }

      @Script('build')
      build() {
        return
      }

      @Script('test')
      test() {
        return
      }
    }

    const p = new PluginsExecutor(undefined, f.path)
    p.registerPluginByConstructor(HelloWorldPlugin)
    await p.executeConstruction()
    // @ts-ignore
    expect(p.appManager.getPackageConfig()).toEqual({
      'devDependencies': {
        '@attachments/serendipity-scripts': '^0.1.12'
      },
      'main': 'index.js',
      'scripts': {
        'build': 'serendipity-scripts run build',
        'start': 'serendipity-scripts run start',
        'test': 'serendipity-scripts run test'
      }
    })
  })

  test('如果插件不含 script 注解，我们不会往 package.json 中添加运行时依赖', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        main: 'index.js'
      })
    })

    class HelloWorldPlugin {
    }

    const p = new PluginsExecutor(undefined, f.path)
    p.registerPluginByConstructor(HelloWorldPlugin)
    await p.executeConstruction()
    // @ts-ignore
    expect(p.appManager.getPackageConfig()).toEqual({
      'main': 'index.js'
    })
  })

  test('测试 render 方法 -- 插件模板的拷贝', async () => {
    const f = fsMock({
      'package.json': JSON.stringify({
        main: 'index.js'
      }),
      'pluginDir': {
        'templates': {
          'foo': {
            'a.out': 'aaa',
            'b.out': 'bbb'
          }
        }
      }
    })

    const pe = new PluginsExecutor(undefined, f.path)
    // @ts-ignore
    await pe.render(f.resolve('pluginDir'), 'foo')
    expect(fs.existsSync(f.resolve('a.out'))).toBeTruthy()
    expect(fs.existsSync(f.resolve('b.out'))).toBeTruthy()
  })
})
