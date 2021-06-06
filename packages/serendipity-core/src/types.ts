// 创建时相关配置
import { BaseObject } from '@attachments/serendipity-public'
import { AppManager } from './app-manager'
import { PluginWrapper } from './plugin-wrapper'

export interface CreateOptions {
  // basic
  name: string
  presetPath: string

  // git
  initGit?: boolean
  gitMessage?: string

  // 基础路径
  workingDir?: string
}

// add 命令配置
export interface AddOption {
  version?: string
  localPath?: string
  delete?: boolean
}

// 质询问题结果
export type InquiryResult = BaseObject

// app 配置
export interface AppPluginConfig {
  name: string,
  options?: BaseObject
}

// app 配置，针对 service 的额外配置可以
export interface AppConfig {
  plugins?: AppPluginConfig[]
}

// plugin 模块信息
export interface PluginModuleInfo {
  // require 的结果
  requireResult: any

  // 该插件的绝对路径
  absolutePath?: string

  // 额外的参数
  options?: BaseObject

  // 名称
  name?: string
}

export interface ScriptOptions {
  appManager: AppManager
  matchPlugin: (name: string) => PluginWrapper
  inquiryResult?: BaseObject
}

export interface RuntimeOptions {
  appManager: AppManager
  matchPlugin: (name: string) => PluginWrapper
}

export interface ConstructionOptions {
  appManager: AppManager
  matchPlugin: (name: string) => PluginWrapper
  inquiryResult: unknown
  renderTemplate: (name: string, options?: BaseObject, target?: string) => void
}

// 预设配置
export interface PresetPlugin {
  // plugin 名称
  name: string

  // plugin 所在的本地路径
  path?: string

  // 要安装的 plugin 版本，默认为 latest
  version?: string

  // 是否在构建阶段之后移除之
  removeAfterConstruction?: boolean

  // 质询覆盖
  overrideInquiries?: BaseObject
}

// 脚手架预设配置
export interface SerendipityPreset {
  // 插件
  plugins: PresetPlugin[]
}

export interface PluginMethodMetaBase {
  methodName: string
  metaResult: any
}

export interface PluginMetaScript extends PluginMethodMetaBase {
  command: string
}

export type PluginMetaInquiry = PluginMethodMetaBase
export type PluginMetaConstruction = PluginMethodMetaBase
export type PluginMetaRuntime = PluginMethodMetaBase

export interface PluginMetaData {
  name: string
  scripts: PluginMetaScript[]
  inquiries: PluginMetaInquiry[]
  constructions: PluginMetaConstruction[]
  runtime: PluginMetaRuntime[]
}
