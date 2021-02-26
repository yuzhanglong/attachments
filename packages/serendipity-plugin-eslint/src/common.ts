/*
 * File: common.ts
 * Description: 一些常量
 * Created: 2021-2-26 21:08:45
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { ConfigOptions, EslintCustomConfig } from './types'

export const ESLINT_OPTION_TO_CONFIG: Record<ConfigOptions, EslintCustomConfig> = {
  'Airbnb': {
    package: 'eslint-config-airbnb',
    extendName: 'airbnb-base',
    version: 'latest'
  },
  'recommend': {
    package: null,
    extendName: 'eslint:recommended',
    version: 'latest'
  }
}