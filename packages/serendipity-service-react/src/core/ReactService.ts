/*
 * File: ReactService.ts
 * Description: ReactService 核心
 * Created: 2021-2-2 18:34:12
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import { Configuration, webpack } from 'webpack'
import { PluginModule } from '@attachments/serendipity-public/bin/types/plugin'
import * as WebpackDevServer from 'webpack-dev-server'
import {
  WebpackConfiguration,
  WebpackDevServerConfiguration
} from '@attachments/serendipity-public/bin/types/common'
import { logger, webpackMerge } from '@attachments/serendipity-public'
import getDevServerConfig from '../webpack/devServerConfig'
import getBaseConfig from '../webpack/webpackBase'
import { configFile } from '../utils/paths'
import { clearConsole } from '../utils/console'
import { ReactServiceAppConfig } from '../types/common'
import { DEFAULT_WEBPACK_DEV_SERVER_HOST, DEFAULT_WEBPACK_DEV_SERVER_PORT } from '../common/constants'

class ReactService {
  private readonly appConfig: ReactServiceAppConfig
  private readonly devServerConfig: WebpackDevServerConfiguration

  private webpackConfig: WebpackConfiguration

  constructor() {
    this.appConfig = fs.existsSync(configFile) ? require(configFile) : {}
    this.webpackConfig = getBaseConfig(this.appConfig)
    this.devServerConfig = getDevServerConfig()
  }

  /**
   * 合并 webpack 配置
   *
   * @author yuzhanglong
   * @date 2021-2-4 00:50:55
   */
  private mergeWebpackConfig(...configurations: WebpackConfiguration[]): void {
    this.webpackConfig = webpackMerge(this.webpackConfig, ...configurations)
  }


  /**
   * 执行运行时插件
   *
   * @author yuzhanglong
   * @date 2021-2-3 12:17:55
   */
  private runRuntimePlugins(): void {
    if (Array.isArray(this.appConfig.plugins)) {
      for (const plugin of this.appConfig.plugins) {
        const pluginModule: PluginModule = require(plugin)
        pluginModule.runtime({
          mergeWebpackConfig: this.mergeWebpackConfig.bind(this)
        })
      }
    }
  }

  /**
   * 启动项目(开发环境)
   *
   * @author yuzhanglong
   * @date 2021-2-3 12:15:09
   */
  public start(): void {
    // 执行插件运行时逻辑
    this.runRuntimePlugins()

    // 尝试从用户配置文件中获取配置，它的优先级较高
    if (this.appConfig?.webpack?.webpackConfig) {
      this.mergeWebpackConfig(this.appConfig.webpack.webpackConfig)
    }

    // devServer 选项合并
    const devServerOptions = Object.assign({}, this.devServerConfig)

    process.env.DEV_SERVER_PORT = String(devServerOptions.port)

    // 初始化 webpack compiler 见 webpack node.js API
    const compiler = webpack(this.webpackConfig as Configuration)

    // 启动 webpackDevServer 服务器
    // @ts-ignore
    const server = new WebpackDevServer(compiler, devServerOptions)

    // 配置监听端口、主机，这里直接取用户的配置文件来覆盖，如果用户配置文件不存在则取 9000 -- 0.0.0.0
    // 也就是说对于上述的两个配置，用户在 webpack 中的配置、插件 mergeWebpack 的配置是无效的
    // 这样做的原因是部分插件需要打印一些信息（例如项目所处的端口），这些数据不能写死，但又难拿到用户的配置
    // 干脆端口和主机就以用户项目配置文件为准
    server.listen(
      this.appConfig?.additional?.webpackDevServerPort || DEFAULT_WEBPACK_DEV_SERVER_PORT,
      this.appConfig?.additional?.webpackDevServerHost || DEFAULT_WEBPACK_DEV_SERVER_HOST,
      ReactService.onWebpackServerListen
    )
  }

  /**
   * 构建项目 (生产环境)
   *
   * @author yuzhanglong
   * @date 2021-2-6 18:28:34
   */
  public build(): void {

    // 构建项目，同样地执行 Runtime Plugin
    this.runRuntimePlugins()

    // 尝试从用户配置文件中获取配置，它的优先级较高
    if (this.appConfig?.webpack?.webpackConfig) {
      this.mergeWebpackConfig(this.appConfig.webpack.webpackConfig)
    }

    // 初始化 webpack compiler
    const compiler = webpack(this.webpackConfig as Configuration)

    compiler.run(() => {
      return
    })
  }

  /**
   * 在 webpackDevServer 启动时做些什么
   *
   * @author yuzhanglong
   * @date 2021-2-10 21:12:49
   */
  private static onWebpackServerListen(): void {
    clearConsole()
    logger.info('项目正在构建中，请稍候...')
  }
}

export default ReactService