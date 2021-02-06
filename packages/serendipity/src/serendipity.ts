#!/usr/bin/env node

/*
 * File: DemoCli.js
 * Description: Cli Demo
 * Created: 2021-1-23 14:33:58
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import { AddOptions, CreateOptions } from '@attachments/serendipity-public/bin/types/common'
import { program } from 'commander'
import CoreManager from './coreManager'
import { DEFAULT_PROJECT_NAME } from './common'


// 版本信息
program.version(`serendipity ${require('../package').version}`)

// serendipity create
program
  .command('create [app-name]')
  .description('开始创建一个前端项目(*^▽^*)~')
  .option('-t --type <projectType>', '项目类型')
  .option('-s --service <serviceName>', '选择一个项目 service，如 \'react\'')
  .option('-g --git', '初始化 git', false)
  .option('-c --commit', '初始化 commit 信息，只有选择初始化 git 时有效', 'initial commit')
  .option('-p --preset', '配置自定义预设，它的默认值和你选择的项目有关')
  .action(async (name: string, opt: CreateOptions) => {
    if (!name) {
      name = DEFAULT_PROJECT_NAME
    }

    // 项目路径为当前路径 + 项目名称
    const projectPath = path.resolve(process.cwd(), name)

    // 初始化 manager
    const manager = new CoreManager(process.argv, projectPath)


    await manager.create(name, opt)
  })

// serendipity add
// 例如: serendipity add xxx  即  serendipity add -n(--name) serendipity-plugin-react
program
  .command('add [plugin-name]')
  .description('添加一个插件')
  .option('-p --package <package>', '自定义插件 package 名称，当已经设置了名称时，该选项无效')
  .action(async (name: string, opt: AddOptions) => {
    // 初始化 manager
    const manager = new CoreManager(process.argv, process.cwd())
    await manager.add(name, opt)
  })

program.parse(process.argv)