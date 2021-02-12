/*
 * File: template.js
 * Description: 模板处理，一般用于项目构建时使用
 * Created: 2021-1-23 17:03:05
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import { PluginConstructionOptions } from '@attachments/serendipity-public/bin/types/plugin'

// 获取模板目录
const getTemplatePath = (name) => {
  return path.resolve(__dirname, '../templates', name)
}


module.exports = (options: PluginConstructionOptions) => {
  // 拷贝模板到工作目录下
  options.render(
    getTemplatePath('react-template')
  )

  // 添加 react 相关依赖
  // 理论上这两行不需要加，但是为了方便 IDE 的智能提示（它们会从 package.json）来搜索依赖，故加上它们，
  // 不过它们不会被重复安装
  options.mergePackageConfig({
    dependencies: {
      'react': '^17.0.1',
      'react-dom': '^17.0.1'
    }
  })
}