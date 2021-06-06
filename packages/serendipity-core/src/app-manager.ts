/*
 * File: appManager.ts
 * Description: appManager 类，用来封装针对生成项目的一些操作
 * Created: 2021-2-16 22:46:26
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import * as path from 'path'
import { isPlugin, PackageManager, logger, BaseObject, writeFilePromise } from '@attachments/serendipity-public'
import { AppConfig, PluginModuleInfo } from './types'

interface AppManagerOptions {
  basePath: string
  appConfig?: AppConfig
  packageManager?: PackageManager
}

type BasicCreateOptions = Omit<AppManagerOptions, 'packageManager'> & {
  packageConfig: BaseObject
}

export class AppManager {
  // 根路径
  private readonly basePath: string

  // package 管理模块
  public packageManager: PackageManager

  // App 配置管理模块
  private readonly appConfig: AppConfig


  constructor(options: AppManagerOptions) {
    const { basePath, appConfig, packageManager } = options
    this.basePath = basePath
    this.appConfig = appConfig
    this.packageManager = packageManager
  }

  /**
   * 基于基本路径，通过读取文件的方式获得 appConfig 和 packageConfig 以初始化 AppManager
   *
   * @author yuzhanglong
   * @param basePath 基本路径
   * @date 2021-5-29 00:51:04
   */
  public static createWithResolve(basePath: string) {
    const appConfig = AppManager.resolveAppConfig(basePath)
    const pm = PackageManager.createWithResolve(basePath)
    return new AppManager({
      appConfig: appConfig,
      packageManager: pm,
      basePath: basePath
    })
  }

  /**
   * appManager 默认的工厂方法
   *
   * @author yuzhanglong
   * @date 2021-5-29 01:14:27
   * @param createOptions 相关选项，请参考相应的类型定义
   * @see {BasicCreateOptions}
   */
  public static createAppManager(createOptions: BasicCreateOptions) {
    const { appConfig, basePath, packageConfig } = createOptions
    const pm = PackageManager.createWithOptions({
      basePath: basePath,
      packageConfig: packageConfig
    })

    return new AppManager({
      appConfig: appConfig,
      packageManager: pm,
      basePath: basePath
    })
  }

  /**
   * 从文件中读取 app 配置，如果读取失败则赋值一个空对象：{}
   *
   * @author yuzhanglong
   * @param basePath 基本路径
   * @date 2021-5-29 00:51:04
   */
  public static resolveAppConfig(basePath: string) {
    const configPath = path.resolve(basePath, 'serendipity.js')
    return fs.existsSync(configPath) ? require(configPath) : {}
  }

  /**
   * 获取符合条件的所有 plugin
   *
   * @author yuzhanglong
   * @return 所有 plugin 的字符串集合
   * @date 2021-2-16 23:14:03
   * @see {isPlugin}
   */
  public getPluginList(): string[] {
    const dependenciesKey = Object.keys(this.getPackageConfig().dependencies || {})
    const devDependenciesKey = Object.keys(this.getPackageConfig().devDependencies || {})
    return [].concat(dependenciesKey, devDependenciesKey).filter(res => isPlugin(res))
  }

  /**
   * 以模块（require）的方式获取所有 plugins
   *
   * @author yuzhanglong
   * @return 所有 plugin 的字符串集合
   * @date 2021-2-16 23:14:03
   */
  public getPluginModules(): PluginModuleInfo[] {
    return this.getPluginList().map(plugin => {
      const target = path.resolve(this.basePath, 'node_modules', plugin)
      let requireResult
      try {
        requireResult = require(target)
      } catch (e) {
        logger.warn(`plugin ${plugin} resolve failed!`)
        requireResult = null
      }
      return {
        requireResult: requireResult,
        absolutePath: target,
        options: this.getPluginOptionByName(plugin),
        name: plugin
      }
    })
  }

  /**
   * app config getter
   *
   * @author yuzhanglong
   * @date 2021-2-16 23:26:44
   */
  public getAppConfig(): AppConfig {
    return this.appConfig
  }

  /**
   * packageConfig getter
   *
   * @author yuzhanglong
   * @date 2021-2-16 23:26:47
   */
  public getPackageConfig() {
    return this.packageManager.getPackageConfig()
  }

  /**
   * base path getter
   *
   * @author yuzhanglong
   * @date 2021-2-21 00:11:42
   */
  public getBasePath(): string {
    return this.basePath
  }

  /**
   * 通过 plugin 的名称(这个名称基于 package.json dependence 的 key)
   * 从 app 配置中寻找 options(如果有的话)
   *
   * @author yuzhanglong
   * @param name plugin 名称
   * @date 2021-2-25 20:54:17
   */
  public getPluginOptionByName(name: string) {
    let result = {}
    if (this.appConfig?.plugins) {
      const pg = this.appConfig.plugins.filter(plugin => plugin.name === name)
      if (pg.length >= 1) {
        if (pg.length >= 2) {
          logger.warn(`插件 ${name} 在配置文件中被声明了两次`)
        }
        // 如果发生重复声明，我们只取最前面的一个
        result = Object.assign(result, pg[0].options)
      }
    }
    return result
  }

  /**
   * 写入默认的 APP 配置文件
   *
   * @author yuzhanglong
   * @date 2021-6-2 23:24:49
   */
  public async writeBaseAppConfig(config?: AppConfig) {
    // stringify
    const jsonifyResult = JSON.stringify(config || {}, null, 2)
    const result = `module.exports = ${jsonifyResult}`
    await writeFilePromise(
      path.resolve(this.basePath, 'serendipity.js'),
      result
    )
  }
}
