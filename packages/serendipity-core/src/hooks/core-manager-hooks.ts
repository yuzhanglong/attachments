/*
 * File: coreManagerHooks.ts
 * Description: core manager 生命周期钩子
 * Created: 2021-3-16 13:44:32
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { SyncHook } from 'tapable'
import { AddOption, CreateOptions } from '../types'

const createCoreManagerHooks = () => {
  return {
    onCreateStart: new SyncHook<any>(['coreManagerInstance']),

    onCreateSuccess: new SyncHook<any>(['coreManagerInstance']),

    onCreateValidateError: new SyncHook<CreateOptions>(['CreateOptions']),

    onAddValidateError: new SyncHook<{
      name: string,
      option: AddOption
    }>(['nameAndOpts']),

    onAddStart: new SyncHook<{
      name: string,
      option: AddOption
    }>(['nameAndOpts']),

    onPluginInstallSuccess: new SyncHook<{
      name: string,
      option: AddOption
    }>(['nameAndOpts']),

    beforePluginDelete: new SyncHook(),

    afterPluginDelete: new SyncHook(),

    onInitWorkDirFail: new SyncHook()
  }
}

export default createCoreManagerHooks
