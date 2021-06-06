/*
 * File: index.ts
 * Description: core 出口
 * Created: 2021-3-14 22:31:05
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


export { RuntimeManager } from './runtime-manager'
export { PresetManager } from './preset-manager'
export { PluginsExecutor } from './plugins-executor'
export { PluginWrapper } from './plugin-wrapper'
export { useSerendipityCreate } from './create'
export { ConstructionManager } from './construction-manager'
export { AppManager } from './app-manager'
export { Script, SerendipityPlugin, Construction, Inquiry, Runtime } from './decorators'
export {
  AppConfig,
  AddOption,
  AppPluginConfig,
  CreateOptions,
  PluginMetaData,
  PluginMethodMetaBase,
  PluginMetaConstruction,
  PluginMetaInquiry,
  PluginMetaRuntime,
  PluginMetaScript,
  RuntimeOptions,
  SerendipityPreset,
  ScriptOptions,
  PluginModuleInfo,
  ConstructionOptions
} from './types'
