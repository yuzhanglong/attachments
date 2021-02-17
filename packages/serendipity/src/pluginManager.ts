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
  inquirer,
  serendipityEnv,
  PackageManager,
  AppManager,
  isPlugin
} from '@attachments/serendipity-public'
import { PluginModule } from '@attachments/serendipity-public/bin/types/plugin'
import { getAppConfigFromConfigFile } from './utils'
import { AddOption } from './types/options'


class PluginManager {
  private readonly basePath: string
  private readonly packageManager: PackageManager
  private readonly version: string
  private readonly localPath: string

  public inquiryResult: InquiryResult
  public pluginModule: PluginModule
  public name: string
  public readonly appManager: AppManager

  constructor(
    basePath: string,
    name: string,
    plugin: PluginModule,
    appConfig?: AppConfig,
    packageManager?: PackageManager,
    version?: string,
    localPath?: string) {
    this.name = PluginManager.getPluginName(name)
    this.pluginModule = plugin
    this.basePath = basePath
    this.packageManager = packageManager ? packageManager : new PackageManager(basePath)
    this.appManager = new AppManager(basePath, appConfig || {})
    this.version = version
    this.localPath = localPath
  }

  /**
   * 工厂函数。add 命令环境下的 pluginManager
   *
   * @author yuzhanglong
   * @param basePath 基础路径
   * @param name 名称
   * @param createOptions 创建时的选项
   * @date 2021-2-13 09:12:53
   */
  static createByAddCommand(basePath: string, name: string, createOptions: AddOption): PluginManager {
    const appConfig = getAppConfigFromConfigFile(
      basePath, () => {
        logger.warn('配置文件 serendipity.js 不存在，请确认选择了正确的目录')
        process.exit(0)
      })

    return new PluginManager(
      basePath,
      name,
      null,
      appConfig,
      PackageManager.createWithResolve(basePath),
      createOptions.version,
      createOptions.localPath
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
        inquiryResult: this.inquiryResult
      })
    } else {
      logger.info('这个 pluginModule 没有 construction 模块，template 初始化将跳过...')
    }
  }

  /**
   * 安装传入的 pluginModule，一般在 add 命令中使用
   *
   * @author yuzhanglong
   * @email yuzl1123@163.com
   * @date 2021-2-5 18:03:39
   */
  public async installPlugin(): Promise<void> {
    const onPluginModuleInstallError = (e) => {
      logger.error('pluginModule 安装失败，请检查其名称是否正确!')
      console.log(e)
      process.exit(0)
    }

    logger.info(`插件 ${this.name} 安装中...`)

    if (!isPlugin(this.name)) {
      logger.warn(`${this.name} 不是一个有效的插件名称，其安装将被跳过...`)
    }


    // 如果 pluginModule 为空，安装并获取 plugin module
    if (!this.pluginModule) {
      // 安装这个 plugin，此时 plugin 的信息会被自动写入 package.json 中，无需再处理
      this.pluginModule = await this.packageManager.addAndInstallModule({
        name: this.name,
        version: this.version,
        localPath: this.localPath,
        onError: onPluginModuleInstallError
      })
    } else {
      // 如果用户没有传入版本号，那我们默认获取最新版本
      // 这样做的目的：如果 this.pluginModule 有值，就会走到这里，不需要 npm install 下载
      // 但是在未来执行 runtime 逻辑时，我们必须要找到插件模块
      // 现在搜索插件的方法是对 用户的 package.json 的所有依赖进行字符串（如 vue-cli 就是这样做的）
      this.packageManager.mergeIntoCurrent({
        dependencies: {
          [this.name]: this.version ? this.version : 'latest'
        }
      })
    }

    // 开始质询
    await this.runPluginInquirer()

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
        appConfig: this.appManager.getAppConfig()
      })
      if (!serendipityEnv.isSerendipityDevelopment() && result) {
        this.inquiryResult = await inquirer.prompt(result)
      } else {
        this.inquiryResult = null
      }
    }
  }

  /**
   * 获取 plugin 名称，我们要求名称以 serendipity-plugin- 开头 或者 以 @attachments
   * 如果不符合上面的要求，则在开头追加 serendipity-plugin-
   *
   * @author yuzhanglong
   * @param name plugin 名称
   * @return 最终 package 名称
   * @date 2021-2-16 20:58:48
   */
  public static getPluginName(name: string): string {
    if (isPlugin(name)) {
      return name
    }
    return 'serendipity-plugin-' + name
  }

  public getPackageManager(): PackageManager {
    return this.packageManager
  }
}

export default PluginManager