#!/usr/bin/env node

/*
 * File: starter.ts
 * Description: @script 在这里通过命令行的形式被执行
 * Created: 2021-2-23 01:39:41
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { program } from 'commander'
import RuntimeManager from './runtimeManager'

// 版本信息
program.version(`serendipity script ${require('../../package.json').version}`)


program
  .command('run [command]')
  .description('执行某个命令')
  .action((command: string) => {
    const rm = new RuntimeManager(process.cwd())
    rm.registerPluginsFromPackage()
    rm.runCommand(command)
  })


program.parse(process.argv)