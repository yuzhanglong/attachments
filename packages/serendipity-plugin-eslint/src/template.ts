/*
 * File: runtime.ts
 * Description: eslint 配置 template plugin
 * Created: 2021-2-4 21:11:13
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { PluginTemplateOptions } from '@attachments/serendipity-public/bin/types/plugin'

module.exports = (options: PluginTemplateOptions) => {
  // react 环境
  if (options.createOptions.type === 'react') {
    options.mergePackageConfig({
      // eslint 配置
      eslintConfig: {
        'extends': [
          'react-app',
          'react-app/jest'
        ],
        'parser': '@babel/eslint-parser'
      }
    })

    // eslint 必要的依赖
    options.mergePackageConfig({
        dependencies: {
          '@babel/eslint-parser': '^7.12.13',
          'eslint': '^7.19.0',
          'eslint-config-react-app': '^6.0.0',
          'eslint-plugin-flowtype': '^5.2.0',
          'eslint-plugin-import': '^2.22.0',
          'eslint-plugin-jest': '^24.0.0',
          'eslint-plugin-jsx-a11y': '^6.3.1',
          'eslint-plugin-react': '^7.22.0',
          'eslint-plugin-react-hooks': '^4.0.8',
          'eslint-plugin-testing-library': '^3.9.0'
        }
      }
    )
  }
}