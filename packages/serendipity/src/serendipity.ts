#!/usr/bin/env node

/*
 * File: DemoCli.js
 * Description: Cli Demo
 * Created: 2021-1-23 14:33:58
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import { program } from 'commander'
import { CreateOptions } from '@attachments/serendipity-public/bin/types/common'
import CoreManager from './coreManager'
import { DEFAULT_PROJECT_NAME } from './common'
import { AddOption } from './types/options'


// 版本信息
program.version(`serendipity ${require('../package').version}`)

// serendipity create
program
  .command('create [app-name]')
  .description('开始创建一个前端项目(*^▽^*)~')
  .option('-t --type <projectType>', '项目类型，如 \'react\'')
  .option('-s --serviceUrl <customizeService>', '自定义项目 service 路径，可以是本地文件')
  .option('-g --git', '初始化 git', false)
  .option('-c --commit', '初始化 commit 信息，只有选择初始化 git 时有效', 'initial commit')
  .option('-p --preset', '配置自定义预设，它的默认值和你选择的项目有关')
  .option('-v --version <version>', 'service 版本，默认为 *')
  .action(async (name: string, opt: CreateOptions) => {
    if (!name) {
      name = DEFAULT_PROJECT_NAME
    }

    // 项目路径为当前路径 + 项目名称
    const projectPath = path.resolve(process.cwd(), name)

    // 初始化 manager
    const manager = new CoreManager(process.argv, projectPath)

    // 执行创建脚本
    await manager.create(name, opt)
  })

// serendipity add
// 例如: serendipity add xxx 即 serendipity add -n(--name) serendipity-plugin-react
program
  .command('add [plugin-name]')
  .description('添加一个插件')
  .option('-v --version <version>', 'plugin 版本，默认为 latest')
  .option('-l --localPath <localPath>', 'plugin 本地路径，追加此选项时 -v 会被忽略')
  .action(async (name: string, opt: AddOption) => {
    // 初始化 manager
    const manager = new CoreManager(process.argv, process.cwd())
    await manager.add(name, opt)
  })

program.parse(process.argv)