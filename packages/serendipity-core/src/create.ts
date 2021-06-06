/**
 * File: create.ts
 * Description: create 命令核心模块
 * Created: 2021-6-3 00:27:29
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */
import * as path from 'path'
import * as fs from 'fs-extra'
import { PresetManager } from './preset-manager'
import createCoreManagerHooks from './hooks/core-manager-hooks'
import { ConstructionManager } from './construction-manager'
import { CreateOptions } from './types/common'


/**
 * 创建一个项目
 *
 * @author yuzhanglong
 * @see CreateOptions 创建选项
 * @date 2021-6-3 00:39:38
 * @param createOptions
 */
export async function useSerendipityCreate(createOptions: CreateOptions) {
  // core hooks
  const coreHooks = createCoreManagerHooks()

  // workingDir 表示命令行执行的目录
  const { presetPath, name, initGit, gitMessage, workingDir } = createOptions

  const currentDir = workingDir || process.cwd()

  // projectDir 表示项目的实际目录(在工作目录之下)，注意和上面的区分
  const projectDir = path.resolve(currentDir, name)

  // 如果 projectDir 不存在，创建之
  await fs.ensureDir(projectDir)

  // 初始化预设管理器
  const pm = await PresetManager.createPresetManager(presetPath, projectDir)

  const execute = async () => {
    // [hooks] -- beforePluginInstall 在 plugin 安装前做些什么
    coreHooks.onCreateStart.call(this)

    // 初始化 ConstructionManager（构建管理）
    const constructionManager = new ConstructionManager(projectDir)

    // 安装 preset 列出的所有插件
    await constructionManager.installPluginsFromPresets(pm.getPreset())

    // 此时所有插件都已经安装完成
    // 接下来执行插件 @Construction 下的逻辑, 合并 package.json
    await constructionManager.runPluginConstruction(null, pm.getPreset())

    // 安装合并进来的依赖
    await constructionManager.installDependencies()

    // 初始化 git(如果用户选择的话)
    if (initGit) {
      await constructionManager.initGit(gitMessage)
    }

    // [hooks] -- onCreateSuccess 在 create 执行结束时做些什么
    coreHooks.onCreateSuccess.call(this)
  }

  return {
    coreHooks: coreHooks,
    execute: execute,
    presetManager: pm,
    workingDir: projectDir
  }
}
