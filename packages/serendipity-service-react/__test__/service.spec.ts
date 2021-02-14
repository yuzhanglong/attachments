/*
 * File: service.spec.ts
 * Description: service 模块测试
 * Created: 2021-2-8 15:19:27
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { ServiceOption } from '@attachments/serendipity-public/bin/types/cliService'

describe('react-service 模块测试', () => {
  test('模块执行测试', () => {
    const service = require('../bin/service')
    const pluginRegisterFn = jest.fn(() => {
      return
    })
    const options: ServiceOption = {
      setPackageConfig: ({ dependencies }) => {
        expect(dependencies['@attachments/serendipity-service-react'])
          .toStrictEqual(require('../package.json').version)
      },
      registerPlugin: pluginRegisterFn
    }
    service(options)
    expect(pluginRegisterFn).toBeCalledTimes(2)
  })

  test('用户选择开启 eslint 支持', () => {
    const service = require('../bin/service')
    const pluginRegisterFn = jest.fn(() => {
      return
    })
    const options: ServiceOption = {
      setPackageConfig: () => {
        return
      },
      registerPlugin: pluginRegisterFn,
      inquiryResult: {
        eslintSupport: true
      }
    }
    service(options)
    expect(pluginRegisterFn).toBeCalledTimes(3)
  })
})

