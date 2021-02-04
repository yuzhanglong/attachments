/*
 * File: index.ts
 * Description: 公共资源包出口
 * Created: 2021-2-4 12:50:03
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as execa from 'execa'
import * as chalk from 'chalk'
import { runCommand } from './utils/command'
import webpackMerge from 'webpack-merge'
import serendipityEnv from './utils/env'
import * as deepmerge from 'deepmerge'
import * as inquirer from 'inquirer'


export {
  execa,
  chalk,
  runCommand,
  webpackMerge,
  serendipityEnv,
  deepmerge,
  inquirer
}