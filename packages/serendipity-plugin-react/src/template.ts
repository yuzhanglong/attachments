/*
 * File: template.js
 * Description: 模板处理，一般用于项目构建时使用
 * Created: 2021-1-23 17:03:05
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { PluginTemplateOptions } from '@attachments/serendipity-public/bin/types/plugin'
import * as path from 'path'


const getTemplatePath = (name) => {
  return path.resolve(__dirname, '../templates', name)
}


module.exports = (options: PluginTemplateOptions) => {
  options.render(getTemplatePath('react-template'), {

  })
}