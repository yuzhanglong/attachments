/*
 * File: hooks.ts
 * Description: react service hooks
 * Created: 2021-2-23 23:30:46
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { SyncHook } from 'tapable'
import { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'


export interface ReactServiceHooks {
  beforeWebpackStart: SyncHook<(...configurations: WebpackConfiguration[]) => void>
  beforeDevServerStart: SyncHook<WebpackDevServerConfiguration>
}
