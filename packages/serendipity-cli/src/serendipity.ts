#!/usr/bin/env node

/*
 * File: serendipity.js
 * Description: Cli Entry
 * Created: 2021-1-23 14:33:58
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { program } from 'commander'
import { useSerendipityCreate } from '@attachments/serendipity-core'
import { DEFAULT_PROJECT_NAME } from '@attachments/serendipity-public'
import { registerCreateHook } from './hooks-register'


// 版本信息
program
  .version(`serendipity ${require('../package').version}`)

// serendipity create，创建一个由 serendipity 管理的项目
program
  .command('create [app-name]')
  .description('基于 preset 创建一个前端项目/初始化模板')
  .option('-g --git', '初始化 git', false)
  .option('-c --commit <message>', '初始化 commit 信息，只有选择初始化 git 时有效', 'chore: initial commit')
  .option('-p --preset <preset>', '选择一个创建预设 (preset)，可以是本地文件或者 http 链接')
  .action(async (name: string, opt: any) => {
    const { preset, commit, git } = opt

    // 初始化 manager
    const instance = await useSerendipityCreate({
      initGit: git,
      name: name || DEFAULT_PROJECT_NAME,
      presetPath: preset,
      gitMessage: commit
    })

    // 注册钩子
    registerCreateHook(instance.coreHooks)

    // 执行
    await instance.execute()
  })

program.parse(process.argv)
