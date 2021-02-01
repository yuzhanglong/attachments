#!/usr/bin/env node

/*
 * File: service.js
 * Description: 针对某个框架的 service 服务
 * Created: 2021-1-23 16:35:05
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import ReactService from './ReactService'
import * as program from 'commander'

const reactService = new ReactService()


program
  .command('start')
  .description('执行开发 server')
  .action(() => {
    console.log('dev server 被执行了~')
    reactService.start()
  })


program
  .command('build')
  .description('打包您的项目')
  .action(() => {
    console.log('build 被执行了~')
  })