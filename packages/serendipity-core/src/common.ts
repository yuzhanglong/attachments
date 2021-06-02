/*
 * File: common.ts
 * Description: 常量
 * Created: 2021-2-7 00:59:06
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { DEFAULT_PROJECT_NAME } from '@attachments/serendipity-public'

export const APP_CONFIG_NAME = 'serendipity.js'

export const DEFAULT_COMMIT_MESSAGE = 'chore: initial commit'

// pluginMetaKeys
export const PLUGIN_SCRIPT_META_KEY = 'plugin-script'

export const PLUGIN_NAME_META_KEY = 'plugin-name'

export const PLUGIN_INQUIRY_META_KEY = 'plugin-inquiry'

export const PLUGIN_CONSTRUCTION_META_KEY = 'plugin-construction'

export const PLUGIN_RUNTIME_META_KEY = 'plugin-runtime'

export const DEFAULT_PRESET = {
  initialDir: true,
  initialDirDefaultName: DEFAULT_PROJECT_NAME,
  plugins: []
}

export const SERENDIPITY_SCRIPT_VERSION = '^0.1.12'
