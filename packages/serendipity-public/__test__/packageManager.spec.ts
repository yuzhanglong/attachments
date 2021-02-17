/*
 * File: packageManager.spec.ts
 * Description: packageManager 测试
 * Created: 2021-2-17 17:47:50
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { PackageManager } from '@attachments/serendipity-public'

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
      name: 'foo',
    })).toStrictEqual('yarn add foo')
  })
})
