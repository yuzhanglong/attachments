#!/usr/bin/env node

/*
 * File: scripts.js
 * Description: 针对某个框架的 service 服务
 * Created: 2021-1-23 16:35:05
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as program from 'commander'
import { serendipityEnv } from '@attachments/serendipity-public'
import ReactService from './ReactService'


program
  .command('start')
  .description('执行开发 server')
  .action(() => {

    // 初始化环境变量
    serendipityEnv.setProjectDevelopment()

    // 初始化 service
    const reactService = new ReactService()

    // 调用 start 方法，执行内部逻辑
    reactService.start()
  })


program
  .command('build')
  .description('打包您的项目')
  .action(() => {
    // 初始化环境变量
    serendipityEnv.setProjectProduction()

    // 初始化 service
    const reactService = new ReactService()

    // 执行 build 命令
    reactService.build()
  })

program.parse(process.argv)