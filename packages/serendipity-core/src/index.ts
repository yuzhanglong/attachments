/*
 * File: index.ts
 * Description: core 出口
 * Created: 2021-3-14 22:31:05
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import AppManager from './appManager'
import ConstructionManager from './constructionManager'
import CoreManager from './coreManager'
import PluginExecutor from './pluginExecutor'
import SerendipityPlugin from './pluginFactory'
import PresetManager from './presetManager'
import RuntimeManager from './runtimeManager'
import { getAppConfigFromConfigFile, getBasePackageJsonContent } from './utils'


export {
  SerendipityPlugin,
  Construction,
  Inquiry,
  Runtime,
  Script
} from './decorators'


export {
  CoreManager,
  ConstructionManager,
  RuntimeManager,
  PluginExecutor,
  AppManager,
  SerendipityPlugin,
  PresetManager,
  getAppConfigFromConfigFile,
  getBasePackageJsonContent
}
