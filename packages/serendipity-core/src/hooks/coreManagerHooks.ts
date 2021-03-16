/*
 * File: coreManagerHooks.ts
 * Description: core manager 生命周期钩子
 * Created: 2021-3-16 13:44:32
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { SyncHook } from 'tapable'
import { CreateOptions } from '@attachments/serendipity-public/bin/types/common'
import CoreManager from '../coreManager'
import { AddOption } from '../types/options'

const createCoreManagerHooks = () => {
  return {
    onCreateStart: new SyncHook<CoreManager>(['coreManagerInstance']),

    onCreateSuccess: new SyncHook<CoreManager>(['coreManagerInstance']),

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