/*
 * File: ServiceManager.ts
 * Description: Service 层管理
 * Created: 2021-1-30 17:58:46
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as path from 'path'
import { PluginModule } from '@attachments/serendipity-public/bin/types/plugin'
import { AppConfig, CommonObject, CreateOptions, InquiryResult } from '@attachments/serendipity-public/bin/types/common'
import {
  writeFilePromise,
  inquirer,
  runCommand,
  logger,
  serendipityEnv,
  PackageManager
} from '@attachments/serendipity-public'
import { ServiceModule } from '@attachments/serendipity-public/bin/types/cliService'
import PluginManager from './pluginManager'

class ServiceManager {
  private readonly basePath: string
  private readonly createOptions: CreateOptions
  private readonly packageManager: PackageManager
  private readonly appConfig: AppConfig

  private serviceModule: ServiceModule
  private inquiryResult: InquiryResult
  private pluginManagers: PluginManager[] = []

  constructor(basePath: string, createOptions: CreateOptions, serviceModule?: ServiceModule, appConfig?: AppConfig) {
    this.createOptions = createOptions
    this.basePath = basePath
    this.serviceModule = serviceModule
    this.appConfig = appConfig || {}
    this.packageManager = new PackageManager(basePath)
  }

  /**
   * 获得所有的 plugin 管理器
   *
   * @author yuzhanglong
   * @date 2021-1-30 19:12:51
   */
  getPluginManagers(): PluginManager[] {
    return this.pluginManagers
  }

  /**
   * 初始化 package.json
   *
   * @author yuzhanglong
   * @param config package.json 内容
   * @date 2021-1-29 13:48:49
   */
  setPackageConfig(config: CommonObject): void {
    this.packageManager.setPackageConfig(config)
  }

  /**
   * 注册 plugin 接口
   *
   * @author yuzhanglong
   * @param name plugin 名称
   * @param pluginModule plugin 模块（require 后）
   * @date 2021-1-30 19:14:42
   */
  registerPlugin(name: string, pluginModule?: PluginModule): void {
    const manager = new PluginManager(
      this.basePath,
      name,
      pluginModule,
      this.appConfig,
      this.packageManager
    )
    this.pluginManagers.push(manager)
  }

  /**
   * 执行 plugin 模板钩子
   *
   * @author yuzhanglong
   * @date 2021-1-29 11:51:36
   */
  async runPluginsConstruction(): Promise<void> {
    for (const pluginManager of this.pluginManagers) {
      // 安装 plugin
      await pluginManager.installPlugin()
    }
  }

  /**
   * 写入 package.json
   *
   * @author yuzhanglong
   * @date 2021-1-30 12:33:08
   */
  async writePackageConfig(): Promise<void> {
    await this.packageManager.writePackageConfig()
  }

  /**
   * 准备 app 配置文件，这个配置文件面向用户
   * 用户可以在这个配置文件中进行一些操作，例如修改 webpack 配置等
   *
   * @author yuzhanglong
   * @date 2021-2-2 20:32:45
   */
  async setAppConfig(): Promise<void> {
    // 合并用户注册的 plugins 到 config 文件中
    await ServiceManager.writeAppConfig(this.basePath, this.appConfig)
  }

  /**
   * 写入 App 配置文件  // TODO: 使用 AppManager 取代之
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
   * 执行工程创建时 serviceModule 的能力，例如初始化 package.json 配置
   *
   * @author yuzhanglong
   * @date 2021-1-30 18:54:44
   */
  runCreateWorkTasks(): void {
    this.serviceModule?.service({
      setPackageConfig: this.setPackageConfig.bind(this),
      registerPlugin: this.registerPlugin.bind(this),
      inquiryResult: this.inquiryResult
    })
  }

  /**
   * 为 serviceModule 管理的目录 初始化 git
   *
   * @author yuzhanglong
   * @date 2021-1-30 19:27:18
   */
  async initServiceGit(): Promise<void> {
    if (this.createOptions.initGit) {
      logger.info('正在初始化 git 仓库...')
      try {
        await runCommand('git init', [], this.basePath)
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
   * 安装所有依赖
   *
   * @author yuzhanglong
   * @date 2021-2-2 19:50:10
   */
  async install(): Promise<void> {
    await this.packageManager.installDependencies()
  }

  /**
   * 执行 serviceModule inquirer
   *
   * @author yuzhanglong
   * @date 2021-2-4 12:40:24
   */
  async runServiceInquirer(): Promise<void> {
    if (this.serviceModule.inquiry) {
      const result = this.serviceModule.inquiry({
        createOptions: this.createOptions
      })
      if (!serendipityEnv.isSerendipityDevelopment()) {
        this.inquiryResult = await inquirer.prompt(result)
      } else {
        this.inquiryResult = {}
      }
    }
  }

  /**
   * 安装 service package
   * 核心程序 @attachments/serendipity (core) 默认不依赖任何 service 程序，我们需要安装
   * 初始的流程是这样的：
   * 执行 core，此时 core 默认有 service 包的依赖 -- 执行 core-service 模块 -- 连接插件 -- 拉取模板
   * 创建新的 package.json ，新的 package.json 中仍然有 core 的依赖
   *
   * 现在的流程是用户选定了 service，先初始化目录、安装 service
   *
   * @author yuzhanglong
   * @date 2021-2-11 15:42:03
   */
  async installServicePackage(): Promise<void> {
    // 获取 service package 名称, 如果用户自定义了 service 路径 我们使用之
    const servicePackageName = `@attachments/serendipity-service-${this.createOptions.type}`

    logger.info(`开始安装 service package (${servicePackageName})...\n`)

    // 构造 package.json
    this.packageManager.setPackageConfig({
      name: 'serendipity-app',
      version: '0.0.1',
      dependencies: {
        [servicePackageName]: this.getServiceVersion()
      }
    })

    try {
      // 写入 package config
      await this.packageManager.writePackageConfig()

      // 安装 service 模块
      await this.packageManager.installDependencies()
    } catch (e) {
      logger.error('获取 service 包失败，请检查相应的 service 模块是否存在！')
      console.log(e)
      process.exit(0)
    }

    // 拿到 service module 并赋值
    this.serviceModule = this.packageManager.getPackageModule(servicePackageName)

    logger.done('service package 安装成功...\n')
  }

  private getServiceVersion(): string {
    if (this.createOptions.serviceUrl) {
      return this.createOptions.serviceUrl
    }
    return this.createOptions.version || '*'
  }
}

export default ServiceManager