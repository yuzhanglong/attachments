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
import { registerCreateHook } from './hooksRegister'


// 版本信息
program
  .version(`serendipity ${require('../package').version}`)

// serendipity create，创建一个由 serendipity 管理的项目
program
  .command('create [app-name]')
  .description('基于 preset 创建一个前端项目/初始化模板')
  .option('-g --git', '初始化 git', false)
  .option('-c --commit <message>', '初始化 commit 信息，只有选择初始化 git 时有效', 'initial commit')
  .option('-p --preset <preset>', '选择一个创建预设 (preset)，可以是本地文件或者 http 链接')
  .action(async (name: string, opt: any) => {
    const { preset, commit, git } = opt

    // 初始化 manager
    const instance = await useSerendipityCreate({
      initGit: git,
      name: name,
      presetPath: preset,
      gitMessage: commit
    })

    // 注册钩子
    registerCreateHook(instance.coreHooks)

    // 执行
    await instance.execute()
  })

// // serendipity add 为serendipity 管理的项目或者某个一般项目添加插件
// program
//   .command('add [plugin-name]')
//   .description('添加一个插件')
//   .option('-v --version <version>', 'plugin 版本，默认为 latest')
//   .option('-l --localPath <localPath>', 'plugin 本地路径，追加此选项时 -v 会被忽略')
//   .option('-d --delete', '在安装完成之后移除 plugin (用于面向一些只负责构建功能的 plugin)')
//   .action(async (name: string, opt: AddOption) => {
//     // 初始化 manager
//     const manager = new CoreManager()
//
//     // 注册钩子
//     registerCreateHook(manager)
//
//     await manager.add(name, opt)
//   })
//
// program.parse(process.argv)
