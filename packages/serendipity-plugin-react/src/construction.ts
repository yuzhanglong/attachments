/*
 * File: template.js
 * Description: 模板处理，一般用于项目构建时使用
 * Created: 2021-1-23 17:03:05
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import { PluginConstructionOptions } from '@attachments/serendipity-public/bin/types/plugin'
import { ReactPluginInquireResult } from './types'

// 获取模板目录
const getTemplatePath = (name) => {
  return path.resolve(__dirname, '../templates', name)
}


module.exports = (options: PluginConstructionOptions) => {
  // 质询结果
  const useTypeScript = (options.inquiryResult as ReactPluginInquireResult).language === 'TypeScript'

  // package.json 配置
  const getPackageDependencies = () => {
    const base = {}
    return Object.assign(
      base,

      // 添加 react 相关依赖
      // 理论上这两行不需要加，但是为了方便 IDE 的智能提示（它们会从 package.json）来搜索依赖，故加上它们
      // 不过它们不会被重复安装
      {
        'react': '^17.0.1',
        'react-dom': '^17.0.1'
      },

      // 对于 typescript 项目，需要添加类型声明
      useTypeScript ? {
        '@types/node': '^12.0.0',
        '@types/react': '^17.0.0',
        '@types/react-dom': '^17.0.0',
        'typescript': '^4.1.3',
        'fork-ts-checker-webpack-plugin': ''
      } : undefined
    )
  }

  // 拷贝模板到工作目录下
  options.render(
    getTemplatePath(
      useTypeScript ? 'react-template-typescript' : 'react-template'
    )
  )

  options.mergePackageConfig({
    dependencies: getPackageDependencies()
  })
}