/*
 * File: appManager.ts
 * Description: appManager 类，用来封装针对生成项目的一些操作
 * Created: 2021-2-16 22:46:26
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import * as path from 'path'
import { AppConfig, CommonObject } from '../types/common'
import { PluginModule } from '../types/plugin'
import { configFile } from './paths'
import { isPlugin, writeFilePromise } from './files'
import PackageManager from './packageManager'

class AppManager {
  private readonly basePath: string

  private packageManager: PackageManager
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
    this.appConfig = fs.existsSync(configFile) ? require(configFile) : {}
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
  public getPluginModules(): PluginModule[] {
    return this.getPluginList().map(plugin => {
      return require(plugin)
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

}

export default AppManager
