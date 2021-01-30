/*
 * File: mergeDeps.spec.ts
 * Description: 版本合并测试
 * Created: 2021-1-30 14:19:10
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import PluginManager from '../src/core/pluginManager'

describe('package.json 合并配置', () => {
  const pluginManager = new PluginManager('test-path')

  beforeEach(() => {
    pluginManager.setPackageConfig({
      devDependencies: {
        'serendipity-service-react': '0.0.1'
      }
    })
  })

  test('非版本字段合并 -- 没有冲突', () => {
    pluginManager.mergePackageConfig({
      name: 'hello world'
    })

    expect(pluginManager.packageConfig).toStrictEqual({
      name: 'hello world',
      devDependencies: {
        'serendipity-service-react': '0.0.1'
      }
    })
  })

  test('非版本字段合并', () => {
    expect(pluginManager.packageConfig.name).toBeUndefined()
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
    expect(pluginManager.packageConfig).toStrictEqual({
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

    expect(pluginManager.packageConfig).toStrictEqual({
      devDependencies: {
        'foo': '0.2.1',
        'serendipity-service-react': '0.0.1'
      }
    })
  })
})