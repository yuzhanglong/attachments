/*
 * File: reactApp.js
 * Description: react-app preset (本地测试，远程下载无法使用)
 * Created: 2021-2-21 11:41:03
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

const path = require('path')

module.exports = {
  plugins: [
    {
      name: '@attachments/serendipity-plugin-react',
      path: path.resolve(__dirname, '../../packages/serendipity-plugin-react')
    },
    {
      name: '@attachments/serendipity-plugin-babel',
      path: path.resolve(__dirname, '../../packages/serendipity-plugin-babel')
    }
  ]
}
