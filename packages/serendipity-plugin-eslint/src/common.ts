/*
 * File: common.ts
 * Description: 一些常量
 * Created: 2021-2-26 21:08:45
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { EslintCustomConfig } from './types'


export const ESLINT_OPTION_TO_CONFIG: Record<string, EslintCustomConfig> = {
  'Airbnb': {
    package: 'eslint-config-airbnb',
    extendName: ['airbnb-base'],
    version: 'latest',
    defaultRules: {}
  },
  'recommend': {
    package: null,
    extendName: ['eslint:recommended'],
    version: 'latest',
    defaultRules: {
      'no-multiple-empty-lines': 1,
    }
  },
  'import': {
    package: 'eslint-plugin-import',
    extendName: [
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript'
    ],
    version: 'latest',
    defaultRules: {
      'import/no-unresolved': 'off',
      'import/order': 'warn'
    }
  }
}