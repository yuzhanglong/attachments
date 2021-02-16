/*
 * File: index.ts
 * Description: 公共资源包出口
 * Created: 2021-2-4 12:50:03
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as execa from 'execa'
import * as chalk from 'chalk'
import * as deepmerge from 'deepmerge'
import * as inquirer from 'inquirer'
import webpackMerge from 'webpack-merge'
import serendipityEnv from './utils/env'
import { runCommand } from './utils/command'
import logger from './utils/logger'
import { fileTreeWriting, isPlugin, writeFilePromise } from './utils/files'
import { getTemplatesData, renderTemplateData } from './utils/template'
import AppManager from './utils/appManager'
import PackageManager from './utils/packageManager'

export {
  execa,
  chalk,
  runCommand,
  webpackMerge,
  serendipityEnv,
  deepmerge,
  inquirer,
  logger,
  fileTreeWriting,
  writeFilePromise,
  getTemplatesData,
  renderTemplateData,
  AppManager,
  PackageManager,
  isPlugin
}