/*
 * File: packageManager.ts
 * Description: 包管理模块
 * Created: 2021-2-12 22:58:04
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import { CommonObject } from '@attachments/serendipity-public/bin/types/common'
import { deepmerge, logger, runCommand, writeFilePromise } from '@attachments/serendipity-public'
import { MergePackageConfigOptions } from '@attachments/serendipity-public/bin/types/cliService'
import { PackageManagerCli } from './types/options'

class PackageManager {
  // 包管理路径
  private readonly basePath: string

  // 管理工具名称
  private readonly cliName: PackageManagerCli
  private packageConfig: CommonObject

  constructor(basePath: string, cliName?: PackageManagerCli) {
    if (!cliName) {
      // 默认采用 yarn 来管理
      this.cliName = 'yarn'
    }
    this.basePath = basePath
    this.packageConfig = {}
  }

  /**
   * 工厂函数，初始化类的同时读取文件来初始化 package.json 的内容
   *
   * @author yuzhanglong
   * @return boolean 是否读取成功
   * @date 2021-2-12 23:20:11
   */
  public static createWithResolve(basePath: string, cliName?: PackageManagerCli): PackageManager {
    const manager = new PackageManager(basePath, cliName)
    manager.resolvePackageConfig()
    return manager
  }

  /**
   * 根据传入的 basePath，读取文件，拿到配置对象
   *
   * @author yuzhanglong
   * @return boolean 是否读取成功
   * @date 2021-2-12 23:20:11
   */
  private resolvePackageConfig(): boolean {
    const packageConfigPath = path.resolve(this.basePath, 'package.json')
    // 尝试 require
    try {
      this.packageConfig = require(packageConfigPath)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  /**
   * 执行配置合并
   *
   * @author yuzhanglong
   * @param data 合并内容
   * @param options 合并配置
   * @date 2021-2-12 23:13:19
   */
  public mergeIntoCurrent(data: CommonObject, options?: MergePackageConfigOptions): void {
    const resultOptions: MergePackageConfigOptions = {
      merge: true,
      ignoreNullOrUndefined: false
    }
    Object.assign(resultOptions, options)

    const dataToMerge = data
    for (const key of Object.keys(dataToMerge)) {
      // 新配置
      const val = dataToMerge[key]

      // 旧配置
      const oldValue = this.packageConfig[key]

      const isDependenciesKey = (key === 'dependencies' || key === 'devDependencies')

      // 选择 忽略 null / undefined 值
      if (resultOptions.ignoreNullOrUndefined && !val) {
        continue
      }

      // 如果不使用 merge 或者之前没有已存在的配置，直接写入即可
      if (!resultOptions.merge || !oldValue) {
        this.packageConfig[key] = val
        continue
      }

      // 是依赖包相关字段
      if (typeof val === 'object' && typeof isDependenciesKey) {
        this.packageConfig[key] = PackageManager.mergeDependencies(
          (oldValue as CommonObject),
          (val as CommonObject)
        )
        continue
      }

      // 普通字段合并
      if (typeof val === 'object' && typeof oldValue === 'object') {
        this.packageConfig[key] = deepmerge(oldValue, val)
      }
    }
  }

  /**
   * 合并 依赖配置
   *
   * @author yuzhanglong
   * @param source 旧依赖
   * @param extend 要被合并上的依赖
   * @date 2021-1-30 18:15:53
   */
  static mergeDependencies(source: CommonObject, extend: CommonObject): CommonObject {
    // TODO: 对于配置冲突 我们暂时采取直接覆盖的方式，之后需要基于 semver 规范优化相关代码
    const result = Object.assign({}, source)

    for (const depName of Object.keys(extend)) {
      const sourceDep = source[depName]
      const extendDep = extend[depName]

      // 值为 null 跳过
      if (extendDep === null) {
        logger.warn(`不合法的版本依赖：${depName}`)
        continue
      }

      // 依赖相同，跳过
      if (sourceDep === extendDep) {
        continue
      }

      // TODO: 细化版本处理
      result[depName] = extendDep
    }
    return result
  }

  /**
   * 将新的配置写入磁盘中
   *
   * @author yuzhanglong
   * @return boolean 是否读取成功
   * @date 2021-2-12 23:18:47
   */
  public async writePackageConfig(): Promise<void> {
    await writeFilePromise(
      path.resolve(this.basePath, 'package.json'),
      // 默认 2 缩进
      JSON.stringify(this.packageConfig, null, 2)
    )
  }

  /**
   * 安装依赖
   *
   * @author yuzhanglong
   * @return boolean 是否读取成功
   * @date 2021-2-12 23:24:40
   */
  public async installDependencies(): Promise<void> {
    await runCommand(
      `${this.cliName} install`,
      [],
      this.basePath)
  }

  /**
   * packageConfig getter
   *
   * @author yuzhanglong
   * @date 2021-2-2 22:06:32
   */
  public getPackageConfig(): CommonObject {
    return this.packageConfig
  }


  /**
   * 安装某个依赖
   *
   * @author yuzhanglong
   * @param name 依赖名称
   * @param onError 安装失败回调函数
   * @return boolean 是否读取成功
   * @date 2021-2-12 23:47:51
   */
  public async addAndInstallModule(name: string, onError?: (e) => void): Promise<CommonObject> {
    try {
      // run yarn add / npm install
      await runCommand(
        `${this.cliName} ${this.cliName === 'yarn' ? 'add' : 'install'} ${name}`,
        [],
        this.basePath
      )
    } catch (e) {
      onError(e)
    }
    return require(path.resolve(this.basePath, 'node_modules', name))
  }


  /**
   * PackageConfig setter
   *
   * @author yuzhanglong
   * @param packageConfig package.json
   * @return boolean 是否读取成功
   * @date 2021-2-13 09:02:33
   */
  public setPackageConfig(packageConfig: CommonObject): void {
    this.packageConfig = packageConfig
  }

  /**
   * 获取某个模块
   *
   * @author yuzhanglong
   * @param name 模块名称
   * @return boolean 是否读取成功
   * @date 2021-2-13 09:02:50
   */
  public getPackageModule(name: string): CommonObject {
    return require(
      path.resolve(this.basePath, 'node_modules', name)
    )
  }
}

export default PackageManager
