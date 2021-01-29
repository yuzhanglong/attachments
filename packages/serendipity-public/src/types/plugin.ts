/*
 * File: plugin.ts
 * Description: 插件声明
 * Created: 2021-1-28 23:56:16
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


export interface PluginModule {
  runtime: PluginRuntime
  template: PluginTemplate
}


export type PluginRuntime = () => void

export type PluginTemplate = () => void