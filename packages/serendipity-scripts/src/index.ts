/*
 * File: index.ts
 * Description: scripts 出口
 * Created: 2021-2-21 10:58:21
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import PluginExecutor from './core/pluginExecutor'
import PluginFactory from './core/pluginFactory'
import {
  Script,
  SerendipityPlugin,
  Inquiry,
  Construction,
  Runtime
} from './core/decorators'

export {
  PluginExecutor,
  PluginFactory,
  Script,
  SerendipityPlugin,
  Inquiry,
  Construction,
  Runtime
}