import * as execa from 'execa'
import * as chalk from 'chalk'
import { runCommand } from './utils/command'
import webpackMerge from 'webpack-merge'
import serendipityEnv from './utils/env'


export {
  execa,
  chalk,
  runCommand,
  webpackMerge,
  serendipityEnv
}