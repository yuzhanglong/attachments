/*
 * File: functionPreset.js
 * Description: 函数式预设
 * Created: 2021-3-2 13:01:36
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

module.exports = () => {
  console.log('hello world')
  return {
    plugins: [
      {
        name: '@attachments/serendipity-plugin-react'
      },
      {
        name: '@attachments/serendipity-plugin-babel'
      }
    ]
  }
}
