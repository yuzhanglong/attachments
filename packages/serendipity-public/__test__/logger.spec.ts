/*
 * File: logger.spec.ts
 * Description: 终端 log 测试
 * Created: 2021-1-29 22:03:39
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import logger from '../bin/utils/logger'

describe('logger 测试', () => {

  test('info', () => {
    logger.info('hello world info')
  })

  test('warn', () => {
    logger.warn('hello world warn')
  })

  test('done', () => {
    logger.done('hello world done')
  })

  test('error', () => {
    logger.error('hello world error')
  })

  test('log', () => {
    logger.log('hello world log')
  })
})