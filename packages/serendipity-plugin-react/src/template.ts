/*
 * File: template.js
 * Description: 模板处理，一般用于项目构建时使用
 * Created: 2021-1-23 17:03:05
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import { PluginTemplateOptions } from '@attachments/serendipity-public/bin/types/plugin'

// 获取模板目录
const getTemplatePath = (name) => {
  return path.resolve(__dirname, '../templates', name)
}


module.exports = (options: PluginTemplateOptions) => {
  // 拷贝模板到工作目录下
  options.render(getTemplatePath('react-template'))
}