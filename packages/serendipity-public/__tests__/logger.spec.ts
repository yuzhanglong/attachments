/*
 * File: logger.spec.ts
 * Description: 终端 log 测试
 * Created: 2021-1-29 22:03:39
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { logger } from '../src'

describe('logger 测试', () => {
  test('info', () => {
    logger.info('hello world info')
    logger.info = jest.fn()
    logger.info('hello world info')
    expect(logger.info).toBeCalledWith('hello world info')
  })

  test('warn', () => {
    logger.warn('hello world warn')
    logger.warn = jest.fn()
    logger.warn('hello world warn')
    expect(logger.warn).toBeCalledWith('hello world warn')
  })

  test('done', () => {
    logger.done('hello world done')
    logger.done = jest.fn()
    logger.done('hello world done')
    expect(logger.done).toBeCalledWith('hello world done')
  })

  test('error', () => {
    logger.error('hello world error')
    logger.error = jest.fn()
    logger.error('hello world error')
    expect(logger.error).toBeCalledWith('hello world error')
  })

  test('log', () => {
    logger.log('hello world log')
    logger.log = jest.fn()
    logger.log('hello world log')
    expect(logger.log).toBeCalledWith('hello world log')
  })
})
