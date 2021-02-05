/*
 * File: mergeDeps.spec.ts
 * Description: 版本合并测试
 * Created: 2021-1-30 14:19:10
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import PluginManager from '../src/pluginManager'

describe('package.json 合并配置', () => {
  const testPlugin = require('@attachments/serendipity-plugin-react')
  let pluginManager: PluginManager

  beforeEach(() => {
    pluginManager = new PluginManager('test-path', 'foo', testPlugin, {}, {
      devDependencies: {
        'serendipity-service-react': '0.0.1'
      }
    })
  })

  test('非版本字段合并 -- 没有冲突', () => {
    pluginManager.mergePackageConfig({
      name: 'hello world'
    })

    expect(pluginManager.getPackageConfig()).toStrictEqual({
      name: 'hello world',
      devDependencies: {
        'serendipity-service-react': '0.0.1'
      }
    })
  })

  test('非版本字段合并', () => {
    expect(pluginManager.getPackageConfig().name).toBeUndefined()
    pluginManager.mergePackageConfig({
      foo: {
        bar: 'hello',
        baz: [1, 2, 4, 6]
      }
    })

    pluginManager.mergePackageConfig({
      foo: {
        bar: 'hello',
        baz: [1, 2, 3, 5],
        quz: 'yzl'
      }
    })
    expect(pluginManager.getPackageConfig()).toStrictEqual({
      foo: {
        bar: 'hello',
        baz: [1, 2, 3, 5],
        quz: 'yzl'
      },
      devDependencies: {
        'serendipity-service-react': '0.0.1'
      }
    })
  })

  test('版本合并测试', () => {
    pluginManager.mergePackageConfig({
      devDependencies: {
        'foo': '0.0.1'
      }
    })

    pluginManager.mergePackageConfig({
      devDependencies: {
        'foo': '0.2.1'
      }
    })

    expect(pluginManager.getPackageConfig()).toStrictEqual({
      devDependencies: {
        'foo': '0.2.1',
        'serendipity-service-react': '0.0.1'
      }
    })
  })
})

describe('app 配置合并测试', () => {
  const testPlugin = require('@attachments/serendipity-plugin-react')
  let pluginManager: PluginManager

  beforeEach(() => {
    pluginManager = new PluginManager('test-path', 'foo', testPlugin, {
      webpack: {
        devServerConfig: {
          port: 8081
        }
      }
    }, {})
  })


  test('尝试 webpack 配置合并', () => {
    pluginManager.mergeAppConfig({
      webpack: {
        devServerConfig: {
          port: 8080
        },
        webpackConfig: {
          module: {
            rules: [
              {
                loader: 'foo-loader'
              }
            ]
          }
        }
      }
    })

    expect(pluginManager.appConfig).toStrictEqual({
      webpack: {
        devServerConfig: {
          port: 8080
        },
        webpackConfig: {
          module: {
            rules: [
              {
                loader: 'foo-loader'
              }
            ]
          }
        }
      }
    })
  })


  test('尝试项目内 app 配置合并(plugins)', () => {
    pluginManager.mergeAppConfig({
      plugins: [
        'foo-plugin',
        'bar-plugin'
      ]
    })
    pluginManager.mergeAppConfig({
      plugins: [
        'foo2-plugin',
        'bar2-plugin',
        'hello-plugin'
      ]
    })

    expect(pluginManager.appConfig).toStrictEqual({
      'plugins': [
        'foo-plugin',
        'bar-plugin',
        'foo2-plugin',
        'bar2-plugin',
        'hello-plugin'
      ],
      'webpack': {
        'devServerConfig': {
          'port': 8081
        }
      }
    })
  })
})