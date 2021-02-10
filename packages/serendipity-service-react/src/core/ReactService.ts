/*
 * File: ReactService.ts
 * Description: ReactService 核心
 * Created: 2021-2-2 18:34:12
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import * as readline from 'readline'
import { Configuration, webpack } from 'webpack'
import { PluginModule } from '@attachments/serendipity-public/bin/types/plugin'
import * as WebpackDevServer from 'webpack-dev-server'
import {
  AppConfig,
  WebpackConfiguration,
  WebpackDevServerConfiguration
} from '@attachments/serendipity-public/bin/types/common'
import { logger, webpackMerge } from '@attachments/serendipity-public'
import getDevServerConfig from '../webpack/devServerConfig'
import getBaseConfig from '../webpack/webpackBase'
import { configFile } from '../utils/paths'
import { clearConsole } from '../utils/console'

class ReactService {
  private readonly appConfig: AppConfig
  private readonly devServerConfig: WebpackDevServerConfiguration

  private webpackConfig: WebpackConfiguration

  constructor() {
    this.appConfig = fs.existsSync(configFile) ? require(configFile) : {}
    this.webpackConfig = getBaseConfig()
    this.devServerConfig = getDevServerConfig()
  }

  /**
   * 合并 webpack 配置
   *
   * @author yuzhanglong
   * @email yuzl1123@163.com
   * @date 2021-2-4 00:50:55
   */
  private mergeWebpackConfig(...configurations: WebpackConfiguration[]): void {
    this.webpackConfig = webpackMerge(this.webpackConfig, ...configurations)
  }


  /**
   * 执行运行时插件
   *
   * @author yuzhanglong
   * @email yuzl1123@163.com
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
   * @email yuzl1123@163.com
   * @date 2021-2-3 12:15:09
   */
  public start(): void {
    // 执行插件运行时逻辑
    this.runRuntimePlugins()

    // 尝试从用户配置文件中获取配置，它的优先级较高
    if (this.appConfig?.webpack?.webpackConfig) {
      this.mergeWebpackConfig(this.appConfig.webpack.webpackConfig)
    }

    // 初始化 webpack compiler 见 webpack node.js API
    const compiler = webpack(this.webpackConfig as Configuration)

    // devServer 选项合并
    const devServerOptions = Object.assign({}, this.devServerConfig)

    // 启动 webpackDevServer 服务器
    // @ts-ignore
    const server = new WebpackDevServer(compiler, devServerOptions)

    // 监听端口
    server.listen(devServerOptions.port, '0.0.0.0', this.onWebpackServerListen)
  }

  /**
   * 构建项目 (生产环境)
   *
   * @author yuzhanglong
   * @email yuzl1123@163.com
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

  onWebpackServerListen(): void {
    clearConsole()
    logger.info('项目正在构建中，请稍候...')
  }
}

export default ReactService