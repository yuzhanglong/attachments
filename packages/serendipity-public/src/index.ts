/*
 * File: index.ts
 * Description: 公共资源包出口
 * Created: 2021-2-4 12:50:03
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

export { isRemotePath, isLocalPath } from './utils/paths'
export { default as webpackMerge } from 'webpack-merge'
export { serendipityEnv } from './utils/env'
export { runCommand } from './utils/run-command'
export { logger } from './utils/logger'
export { fileTreeWriting, isPlugin, writeFilePromise } from './utils/files'
export { getTemplatesData, renderTemplate, renderTemplateData } from './utils/template'
export { PackageManager } from './utils/package-manager'
export { fsMock } from './utils/fs-mock'
export { arrayFlat } from './utils/array-flat'
export { DEFAULT_PRESET_NAME, DEFAULT_PROJECT_NAME, PRESET_CDN_BASE_URL, PACKAGE_JSON_BASE } from './common/constant'

// export types
export {
  BaseObject,
  PackageManagerName,
  ModuleInstallOptions,
  MergePackageConfigOptions,
  Constructable,
  TemplateFilesMapper,
  PackageManagerOptions
} from './types'

import * as execa from 'execa'
import * as chalk from 'chalk'
import * as deepmerge from 'deepmerge'
import * as inquirer from 'inquirer'


export {
  execa,
  chalk,
  deepmerge,
  inquirer
}
