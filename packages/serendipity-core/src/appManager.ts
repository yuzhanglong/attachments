/*
 * File: appManager.ts
 * Description: appManager 类，用来封装针对生成项目的一些操作
 * Created: 2021-2-16 22:46:26
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import * as path from 'path'
import { isPlugin, writeFilePromise, PackageManager, logger, CommonObject } from '@attachments/serendipity-public'
import { AppConfig } from './types/common'
import { PluginModuleInfo } from './types/plugin'


class AppManager {
  private readonly basePath: string

  // package 管理模块
  public packageManager: PackageManager

  // App 配置管理模块
  private appConfig: AppConfig


  constructor(basePath: string, appConfig?: AppConfig, packageConfig?: CommonObject) {
    this.basePath = basePath

    // 如果用户传入配置，我们使用用户的，否则从文件中读取配置，如果读取失败则赋值一个空对象：{}
    if (appConfig) {
      this.appConfig = appConfig
    } else {
      this.readAppConfig()
    }

    if (packageConfig) {
      // 如果用户传入 package 配置，我们使用用户的，否则从 package.json 中读取相应配置
      this.packageManager = new PackageManager(basePath)
      this.packageManager.setPackageConfig(packageConfig)
    } else {
      this.packageManager = PackageManager.createWithResolve(basePath)
    }
  }

  /**
   * 从文件中读取 app 配置，如果读取失败则赋值一个空对象：{}
   *
   * @author yuzhanglong
   * @date 2021-2-16 22:53:52
   */
  private readAppConfig() {
    const configPath = path.resolve(this.getBasePath(), 'serendipity.js')
    this.appConfig = fs.existsSync(configPath) ? require(configPath) : {}
  }

  /**
   * 写入 App 配置文件
   *
   * @author yuzhanglong
   * @date 2021-2-16 22:53:54
   */
  public async writeAppConfig(): Promise<void> {
    // stringify
    const jsonifyResult = JSON.stringify(this.appConfig, null, 2)
    const result = `module.exports = ${jsonifyResult}`
    await writeFilePromise(
      path.resolve(this.basePath, 'serendipity.js'),
      result
    )
  }

  /**
   * 获取符合条件的所有 plugin
   *
   * @author yuzhanglong
   * @return 所有 plugin 的字符串集合
   * @date 2021-2-16 23:14:03
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
  public getPackageConfig(): CommonObject {
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
}

export default AppManager
