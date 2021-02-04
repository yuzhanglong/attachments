/*
 * File: ServiceManager.ts
 * Description: Service 层管理
 * Created: 2021-1-30 17:58:46
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { PluginModule } from '@attachments/serendipity-public/bin/types/plugin'
import { AppConfig, CommonObject, CreateOptions } from '@attachments/serendipity-public/bin/types/common'
import { writeFilePromise } from '@attachments/serendipity-public/bin/utils/files'
import * as path from 'path'
import PluginManager from './pluginManager'
import logger from '@attachments/serendipity-public/bin/utils/logger'
import { runCommand, webpackMerge } from '@attachments/serendipity-public'
import { ServiceModule } from '@attachments/serendipity-public/bin/types/cliService'

class ServiceManager {
  private readonly basePath: string
  private readonly serviceModule: ServiceModule
  private readonly appConfig: AppConfig
  private readonly createOptions: CreateOptions

  private name: string
  private pluginManagers: PluginManager[] = []
  private packageConfig: CommonObject

  constructor(basePath: string, createOptions: CreateOptions, service: ServiceModule) {
    this.createOptions = createOptions
    this.serviceModule = service
    this.basePath = basePath
    this.appConfig = {}
  }

  /**
   * 获得所有的 plugin 管理器
   *
   * @author yuzhanglong
   * @date 2021-1-30 19:12:51
   */
  public getPluginManagers(): PluginManager[] {
    return this.pluginManagers
  }

  /**
   * 初始化 package.json
   *
   * @author yuzhanglong
   * @date 2021-1-29 13:48:49
   */
  public setPackageConfig(config: CommonObject): void {
    this.packageConfig = config
  }

  /**
   * 注册 plugin 接口
   *
   * @author yuzhanglong
   * @date 2021-1-30 19:14:42
   */
  public registerPlugin(pluginModule: PluginModule): void {
    const manager = new PluginManager(this.basePath, pluginModule, this.appConfig, this.packageConfig)
    this.pluginManagers.push(manager)
  }

  /**
   * 执行 plugin 模板钩子
   *
   * @author yuzhanglong
   * @date 2021-1-29 11:51:36
   */
  public runPluginsTemplate(): void {
    for (const pluginManager of this.pluginManagers) {
      pluginManager.runTemplate()
    }
  }

  /**
   * 写入 package.json
   *
   * @author yuzhanglong
   * @date 2021-1-30 12:33:08
   */
  public async writePackageConfig(): Promise<void> {
    await writeFilePromise(
      path.resolve(this.basePath, 'package.json'),
      // 默认 2 缩进
      JSON.stringify(this.packageConfig, null, 2)
    )
  }

  /**
   * 写入 app 配置文件，这个配置文件面向用户
   * 用户可以在这个配置文件中进行一些操作，例如修改 webpack 配置等
   *
   * @author yuzhanglong
   * @date 2021-2-2 20:32:45
   */
  public async writeAppConfig(): Promise<void> {
    // 由于 webpackMerge 库返回的对象是一个新的对象，
    // this.appConfig 不会被插件接口修改，所以我们还要再遍历一遍并合并
    const lastResult = this.collectAppConfig()

    const jsonifyResult = JSON.stringify(lastResult, null, 2)
    const result = `module.exports = ${jsonifyResult}`
    await writeFilePromise(
      path.resolve(this.basePath, 'serendipity.js'),
      result
    )
  }

  /**
   * 收集 app 配置
   *
   * @author yuzhanglong
   * @date 2021-2-3 00:13:02
   */
  collectAppConfig(): AppConfig {
    const reducer = ((previousValue: PluginManager, currentValue: PluginManager) => {
      return webpackMerge(previousValue, currentValue)
    })
    // @ts-ignore
    return this.pluginManagers.reduce(reducer).appConfig
  }

  /**
   * 执行工程创建时 serviceModule 的能力，例如初始化 package.json 配置
   *
   * @author yuzhanglong
   * @date 2021-1-30 18:54:44
   */
  public runCreateWorkTasks(): void {
    this.serviceModule.service({
      configurations: {},
      operations: {
        setPackageConfig: this.setPackageConfig.bind(this),
        registerPlugin: this.registerPlugin.bind(this)
      }
    })
  }

  /**
   * 为 serviceModule 管理的目录 初始化 git
   *
   * @author yuzhanglong
   * @date 2021-1-30 19:27:18
   */
  public async initServiceGit(): Promise<void> {
    logger.log('正在初始化 git 仓库...')
    await runCommand('git init', [], this.basePath)
  }

  /**
   * 初始化构建后提交
   *
   * @author yuzhanglong
   * @date 2021-1-30 19:37:54
   */
  public async initFirstCommit(message: string): Promise<void> {
    await runCommand('git add -A', [], this.basePath)
    await runCommand('git', ['commit', '-m', message, '--no-verify'], this.basePath)
  }

  /**
   * 安装所有依赖
   *
   * @author yuzhanglong
   * @date 2021-2-2 19:50:10
   */
  public async install(): Promise<void> {
    await runCommand('yarn install', [], this.basePath)
  }

  /**
   * 执行 serviceModule inquirer
   *
   * @author yuzhanglong
   * @date 2021-2-4 12:40:24
   */
  public runServiceInquirer(): void {
    this.serviceModule.inquirer({
      basePath: this.basePath,
      projectName: this.name,
      createOptions: this.createOptions
    })
  }
}

export default ServiceManager