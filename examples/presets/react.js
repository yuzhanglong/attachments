/*
 * File: reactApp.js
 * Description: react-app preset
 * Created: 2021-2-21 11:41:03
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

module.exports = {
  initialDir: true,
  initialDirDefaultName: 'hello-react',
  plugins: [
    {
      name: '@attachments/serendipity-plugin-react'
    },
    {
      name: '@attachments/serendipity-plugin-babel'
    }
  ]
}
