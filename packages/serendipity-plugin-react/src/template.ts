/*
 * File: template.js
 * Description: 模板处理，一般用于项目构建时使用
 * Created: 2021-1-23 17:03:05
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

const path = require('path')


// TODO：将这个操作抽离到 service 中 -- 我们只要约定好目录结构就可以避免这些重复操作
const getTemplatePath = (name) => {
  return path.resolve(__dirname, 'templates', name)
}


module.exports = async () => {
  // 基本模板
  console.log('serendipity plugin template!')
  // await options.copyTemplate(getTemplatePath("react-template"), {});
}