#!/usr/bin/env node

/*
 * File: index.ts
 * Description: @script 在这里通过命令行的形式被执行
 * Created: 2021-2-23 01:39:41
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { program } from 'commander'
import { RuntimeManager } from '@attachments/serendipity-core'

// 版本信息
program.version(`serendipity script ${require('../package.json').version}`)


program
  .command('run [command]')
  .description('执行某个命令')
  .action(async (command: string) => {
    const rm = new RuntimeManager(process.cwd())
    rm.registerPluginsFromPackage()
    await rm.runCommand(command)
  })


program.parse(process.argv)
