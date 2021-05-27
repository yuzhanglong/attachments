/*
 * File: common.ts
 * Description: 一般类型定义
 * Created: 2021-1-30 12:19:53
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


// object 类型，不要使用 any
export type BaseObject = Record<string, unknown>


// 包管理工具类型
export type PackageManagerName = 'yarn' | 'npm'

// packageManager 模块安装选项
export interface ModuleInstallOptions {
  // 模块名称
  name: string

  // 模块版本
  version?: string

  // 模块本地路径
  localPath?: string,

  // 失败回调函数
  onError?: (e: Error) => void
}

// 合并 package.json 配置选项
export interface MergePackageConfigOptions {
  merge?: boolean
  ignoreNullOrUndefined?: boolean
}

export interface PackageManagerOptions {
  basePath: string
  managerName?: PackageManagerName
}

export type Constructable<T = unknown> = new (...args: unknown[]) => T;

export type TemplateFilesMapper = Record<string, string>

