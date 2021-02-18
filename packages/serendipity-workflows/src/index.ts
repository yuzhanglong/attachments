#!/usr/bin/env node

/*
 * File: index.ts
 * Description: 项目 workflow package 出口
 * Created: 2021-2-15 22:08:37
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { program } from 'commander'
import { commitMessage } from './vcs/commitMessage'
import { preCommit } from './vcs/preCommit'
import { prePush } from './vcs/prePush'

// 版本信息
program.version(`serendipity-workflows ${require('../package').version}`)

program
  .command('commit-message')
  .option('-p --path <git-commit-path>', 'git commit 临时文件路径')
  .action((opt) => {
    commitMessage(opt.path)
  })


program
  .command('pre-commit')
  .action(() => {
    preCommit()
  })

program
  .command('pre-push')
  .action(() => {
    prePush()
  })

program.parse(process.argv)