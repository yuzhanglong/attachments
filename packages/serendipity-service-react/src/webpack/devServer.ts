/*
 * File: devServer.ts
 * Description: 本地开发服务器配置
 * Created: 2021-2-2 11:44:00
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { WebpackDevServerConfiguration } from '@attachments/serendipity-public/bin/types/common'
import { DEFAULT_PORT } from '../common/constants'

const getDevServerConfig = (): WebpackDevServerConfiguration => {
  return {
    // TODO: 采用自定义输出而不是 webpack-dev-server 的默认输出
    compress: true,

    // 运行端口, 用户可以通过配置文件来覆盖它
    port: DEFAULT_PORT,

    // 添加了 hot 会自动添加 HotModuleReplacementPlugin
    hot: true
  }
}

export default getDevServerConfig