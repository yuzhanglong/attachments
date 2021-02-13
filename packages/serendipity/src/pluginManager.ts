/*
 * File: pluginManager.ts
 * Description: 插件管理器
 * Created: 2021-1-30 18:56:33
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { AppConfig, CommonObject, InquiryResult } from '@attachments/serendipity-public/bin/types/common'
import { getTemplatesData, renderTemplateData } from '@attachments/serendipity-public/bin/utils/template'
import {
  fileTreeWriting,
  logger,
  webpackMerge,
  inquirer,
  serendipityEnv
} from '@attachments/serendipity-public'
import { PluginModule } from '@attachments/serendipity-public/bin/types/plugin'
import PackageManager from './packageManager'
import ServiceManager from './serviceManager'


class PluginManager {
  private readonly basePath: string
  private readonly packageManager: PackageManager

  public inquiryResult: InquiryResult
  public pluginModule: PluginModule
  public name: string
  public appConfig: AppConfig

  constructor(
    basePath: string,
    name: string,
    plugin: PluginModule,
    appConfig?: AppConfig,
    packageManager?: PackageManager) {
    this.name = name
    this.pluginModule = plugin
    this.basePath = basePath
    this.packageManager = packageManager ? packageManager : new PackageManager(basePath)
    this.appConfig = appConfig || {}
  }

  /**
   * 工厂函数。add 命令环境下的 pluginManager
   *
   * @author yuzhanglong
   * @param basePath 基础路径
   * @param name 名称
   * @date 2021-2-13 09:12:53
   */
  static createByAddCommand(
    basePath: string,
    name: string
  ): PluginManager {
    return new PluginManager(
      basePath,
      name,
      null,
      ServiceManager.initAppConfigFromConfigFile(basePath),
      new PackageManager(basePath)
    )
  }

  /**
   * 渲染并写入模板
   *
   * @author yuzhanglong
   * @param base 要写入的绝对路径
   * @param options ejs 选项
   * @date 2021-1-29 13:33:43
   */
  private async renderTemplate(base: string, options?: CommonObject): Promise<void> {
    // 获取映射表
    const filesMapper = await getTemplatesData(base, this.basePath)

    // 渲染模板数据
    renderTemplateData(filesMapper, options || {})

    // 模板拷贝
    await fileTreeWriting(filesMapper)
  }

  /**
   * 执行 pluginModule 构建模块
   *
   * @author yuzhanglong
   * @see PluginModule
   * @date 2021-1-30 19:00:35
   */
  runConstruction(): void {
    if (this.pluginModule?.construction) {
      this.pluginModule.construction({
        render: this.renderTemplate.bind(this),
        mergePackageConfig: this.packageManager.mergeIntoCurrent.bind(this.packageManager),
        mergeAppConfig: this.mergeAppConfig.bind(this),
        inquiryResult: this.inquiryResult
      })
    } else {
      logger.info('这个 pluginModule 没有 template 模块，template 初始化将跳过...')
    }
  }

  /**
   * 合并 app 配置
   *
   * @author yuzhanglong
   * @param appConfig app 配置
   * @see AppConfig
   * @date 2021-2-2 22:05:59
   */
  public mergeAppConfig(appConfig: AppConfig): void {
    this.appConfig = webpackMerge({}, this.appConfig, appConfig)
  }

  /**
   * 安装传入的 pluginModule，一般在 add 命令中使用
   *
   * @author yuzhanglong
   * @email yuzl1123@163.com
   * @date 2021-2-5 18:03:39
   */
  public async installPlugin(): Promise<void> {
    logger.info(`插件 ${this.name} 安装中...`)

    if (!this.name.match(/^(serendipity-plugin-)/)) {
      logger.warn(
        `${this.name} 不是一个推荐的插件名称，插件名称应该以 serendipity-plugin 开头，例如 serendipity-plugin-react`
      )
    }

    // 安装并获取 plugin module
    this.pluginModule = await this.packageManager.addAndInstallModule(this.name, (e) => {
      logger.error('pluginModule 安装失败，请检查其名称是否正确!')
      console.log(e)
      process.exit(0)
    })

    // 更新 app Config
    // plugin 字段不是数组
    if (!Array.isArray(this.appConfig.plugins)) {
      this.appConfig.plugins = []
    }

    // 新引入的 plugin 不存在
    if (this.appConfig.plugins.indexOf(this.name) < 0) {
      this.appConfig.plugins.push(this.name)
    }

    // 执行 template plugin
    this.runConstruction()

    // 写入 PackageConfig
    await this.packageManager.writePackageConfig()

    // 安装所有依赖
    await this.packageManager.installDependencies()
  }

  /**
   * 执行 pluginModule 质询内容
   *
   * @author yuzhanglong
   * @email yuzl1123@163.com
   * @date 2021-2-8 00:29:20
   */
  public async runPluginInquirer(): Promise<void> {
    if (this.pluginModule?.inquiry) {
      const result = this.pluginModule.inquiry({
        // 这里的 appConfig 是最初的配置，没有被修改
        appConfig: this.appConfig
      })
      if (!serendipityEnv.isSerendipityDevelopment() && result) {
        this.inquiryResult = await inquirer.prompt(result)
      } else {
        this.inquiryResult = null
      }
    }
  }

  public getPackageManager(): PackageManager {
    return this.packageManager
  }
}

export default PluginManager