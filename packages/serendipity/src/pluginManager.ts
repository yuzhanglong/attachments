/*
 * File: pluginManager.ts
 * Description: 插件管理器
 * Created: 2021-1-30 18:56:33
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { PluginModule } from '@attachments/serendipity-public/bin/types/plugin'
import { AppConfig, CommonObject } from '@attachments/serendipity-public/bin/types/common'
import { getTemplatesData, renderTemplateData } from '@attachments/serendipity-public/bin/utils/template'
import { fileTreeWriting } from '@attachments/serendipity-public/bin/utils/files'
import { MergePackageConfigOptions } from '@attachments/serendipity-public/bin/types/cliService'
import * as deepmerge from 'deepmerge'
import logger from '@attachments/serendipity-public/bin/utils/logger'
import { webpackMerge } from '@attachments/serendipity-public'

class PluginManager {
  private readonly basePath: string
  private readonly packageConfig: CommonObject

  private plugin: PluginModule
  public appConfig: AppConfig

  constructor(basePath: string, plugin: PluginModule, appConfig: AppConfig, packageConfig: CommonObject) {
    this.plugin = plugin
    this.basePath = basePath
    this.packageConfig = packageConfig
    this.appConfig = appConfig
  }

  /**
   * 渲染并写入模板
   *
   * @author yuzhanglong
   * @param base 要写入的绝对路径
   * @param options ejs 选项
   * @date 2021-1-29 13:33:43
   */
  private async renderTemplate(base: string, options: CommonObject): Promise<void> {
    // 获取映射表
    const filesMapper = await getTemplatesData(base, this.basePath)

    // 渲染模板数据
    renderTemplateData(filesMapper, options)

    // 模板拷贝
    await fileTreeWriting(filesMapper)
  }

  /**
   * 合并 package.json 配置
   *
   * @author yuzhanglong
   * @param data 合并内容
   * @param options 合并配置
   * @date 2021-1-30 12:22:59
   */
  public mergePackageConfig(data: CommonObject, options?: MergePackageConfigOptions): void {
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
        // TODO: 合并依赖
        this.packageConfig[key] = PluginManager.mergeDependencies(
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
   * 执行 plugin 模板钩子
   *
   * @author yuzhanglong
   * @date 2021-1-30 19:00:35
   */
  runTemplate(): void {
    this.plugin.template({
      render: this.renderTemplate.bind(this),
      mergePackageConfig: this.mergePackageConfig.bind(this),
      mergeAppConfig: this.mergeAppConfig.bind(this)
    })
  }


  /**
   * 合并 app 配置
   *
   * @author yuzhanglong
   * @date 2021-2-2 22:05:59
   */
  public mergeAppConfig(appConfig: AppConfig): void {
    this.appConfig = webpackMerge(this.appConfig, appConfig)
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
}

export default PluginManager