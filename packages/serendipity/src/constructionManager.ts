/*
 * File: ServiceManager.ts
 * Description: Service 层管理
 * Created: 2021-1-30 17:58:46
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as path from 'path'
import * as fs from 'fs'
import { AppConfig, CommonObject, Constructor, CreateOptions } from '@attachments/serendipity-public/bin/types/common'
import {
  writeFilePromise,
  runCommand,
  logger,
  AppManager
} from '@attachments/serendipity-public'
import { PluginExecutor } from '@attachments/serendipity-scripts'
import axios from 'axios'
import { getBasePackageJsonContent } from './utils'
import { SerendipityPreset } from './types/preset'

class ConstructionManager {
  private readonly basePath: string
  private readonly createOptions: CreateOptions
  private readonly pluginExecutor: PluginExecutor
  private readonly appManager: AppManager
  private preset: SerendipityPreset

  constructor(basePath: string, createOptions: CreateOptions) {
    this.createOptions = createOptions
    this.basePath = basePath
    // 构建模式下并没有 App 配置文件， 我们使用默认的
    this.appManager = new AppManager(basePath, {}, getBasePackageJsonContent())
    this.pluginExecutor = new PluginExecutor(this.appManager)
    this.preset = {}
  }

  /**
   * 初始化项目 preset
   *
   * @author yuzhanglong
   * @param preset 可选的 preset，是个对象，如果没有传入这个参数，我们会通过网络请求拿到这个 preset
   * @date 2021-2-21 11:46:48
   */
  public async initPreset(preset?: CommonObject) {
    if (!preset) {
      const target = this.createOptions.preset
      if (!target) {
        logger.error('不合法的 preset, preset 的值为一个本地路径或者 url 字符串')
      }
      if (target.startsWith('http://') || target.startsWith('https://')) {
        const response = await axios.get(target)
        const targetPath = path.resolve(this.basePath, 'serendipityPreset.js')
        await writeFilePromise(targetPath, response.data)
        this.preset = require(targetPath)
        // 移除临时 preset 文件
        fs.unlinkSync(targetPath)
      } else {
        this.preset = require(target)
      }
    } else {
      this.preset = preset
    }
  }

  /**
   * 从 preset 安装 plugins
   *
   * @author yuzhanglong
   * @date 2021-2-22 01:28:12
   */
  public async installPluginsFromPresets() {
    const packageManager = this.appManager.packageManager

    if (Array.isArray(this.preset.plugins)) {
      // TODO: remove ts-ignore!
      // @ts-ignore
      const depMapper = {}
      this.preset.plugins.forEach(res => {
        // 路径优先，版本其次，否则使用最新版本 latest
        depMapper[res.name] = res.path || res.version || 'latest'
      })

      this.appManager.packageManager.mergeIntoCurrent({
        dependencies: depMapper
      })
    }

    await packageManager.writePackageConfig()
    await packageManager.installDependencies()
  }

  /**
   * 执行 plugin 构建流程
   *
   * @author yuzhanglong
   * @date 2021-2-21 11:05:50
   */
  public async runPluginConstruction() {
    const pluginConstructors = this.appManager.getPluginModules()
    for (const pluginConstructor of pluginConstructors) {
      if (typeof pluginConstructor === 'object') {
        this.pluginExecutor.registerPlugin((pluginConstructor as { default: Constructor }).default)
      } else {
        this.pluginExecutor.registerPlugin(pluginConstructor)
      }
    }
    await this.pluginExecutor.executeConstruction()
  }

  /**
   * 写入 App 配置文件
   *
   * @param res 配置文件内容
   * @param target 目标目录
   * @author yuzhanglong
   * @date 2021-2-5 21:35:05
   */
  static async writeAppConfig(target: string, res?: AppConfig): Promise<void> {
    // stringify
    const jsonifyResult = JSON.stringify(res, null, 2)
    const result = `module.exports = ${jsonifyResult}`
    await writeFilePromise(
      path.resolve(target, 'serendipity.js'),
      result
    )
  }

  /**
   * 为 serviceModule 管理的目录 初始化 git
   *
   * @author yuzhanglong
   * @date 2021-1-30 19:27:18
   */
  async initGit(): Promise<void> {
    if (this.createOptions.git) {
      logger.info('正在初始化 git 仓库...')
      try {
        // init git
        await runCommand('git init', [], this.basePath)

        // init first commit
        await this.initFirstCommit(this.createOptions.commit)
      } catch (e) {
        logger.error('git 初始化失败！')
      }
      logger.done('git 初始化完成！')
    }
  }

  /**
   * 初始化构建后提交
   *
   * @author yuzhanglong
   * @date 2021-1-30 19:37:54
   */
  async initFirstCommit(message: string): Promise<void> {
    await runCommand('git add -A', [], this.basePath)
    await runCommand('git', ['commit', '-m', message, '--no-verify'], this.basePath)
  }

  /**
   * preset getter
   *
   * @author yuzhanglong
   * @date 2021-2-21 22:40:02
   */
  public getPreset() {
    return this.preset
  }

  /**
   * 调用 packageManager 以安装依赖
   *
   * @author yuzhanglong
   * @date 2021-2-22 15:44:57
   */
  public async installDependencies() {
    // 不要忘记再写入一遍
    await this.appManager.packageManager.writePackageConfig()
    await this.appManager.packageManager.installDependencies()
  }
}

export default ConstructionManager