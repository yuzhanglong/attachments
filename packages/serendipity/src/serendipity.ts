#!/usr/bin/env node

/*
 * File: DemoCli.js
 * Description: Cli Demo
 * Created: 2021-1-23 14:33:58
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { program } from 'commander'
import CliManager from './CliManager'
import 'source-map-support/register'

// 初始化 manager
const manager = new CliManager(process.argv)

// 版本信息
program.version(`serendipity ${require('../package').version}`)

// serendipity create
program
  .command('create <app-name>')
  .description('开始创建一个前端项目(*^▽^*)~')
  .option('-t --type', '项目类型')
  .action(async (name, opt) => {
    await manager.create(name, opt)
  })


program.parse(process.argv)