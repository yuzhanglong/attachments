/*
 * File: reactApp.js
 * Description: react-app preset
 * Created: 2021-2-21 11:41:03
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

const path = require('path')

module.exports = {
  plugins: [
    {
      name: 'serendipity-plugin-hello-world',
      path: path.resolve(__dirname, '../plugin-cases/hello-world')
    }
  ]
}
