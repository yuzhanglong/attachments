/*
 * File: ReactService.ts
 * Description: ReactService 核心
 * Created: 2021-2-2 18:34:12
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { Configuration, webpack } from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import {
  WebpackConfiguration,
  WebpackDevServerConfiguration
} from '@attachments/serendipity-public/bin/types/common'
import { AppManager, logger, serendipityEnv, webpackMerge } from '@attachments/serendipity-public'
import getDevServerConfig from '../webpack/devServerConfig'
import getBaseConfig from '../webpack/webpackBase'
import { clearConsole } from '../utils/console'
import { DEFAULT_WEBPACK_DEV_SERVER_HOST, DEFAULT_WEBPACK_DEV_SERVER_PORT } from '../common/constants'
import { ReactServiceHooks } from '../types/hooks'
import { ReactPluginOptions } from '../types/common'

class ReactService {
  private readonly appManager: AppManager

  private devServerConfig: WebpackDevServerConfiguration
  private webpackConfig: WebpackConfiguration
  private options: ReactPluginOptions
  private hooks: ReactServiceHooks

  constructor(hooks: ReactServiceHooks, options?: ReactPluginOptions) {
    this.appManager = new AppManager(process.cwd())
    this.webpackConfig = getBaseConfig(options)
    this.devServerConfig = getDevServerConfig()
    this.hooks = hooks
    this.options = options
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

  private mergeDevServerConfig(...configurations: WebpackDevServerConfiguration[]): void {
    this.devServerConfig = webpackMerge(this.devServerConfig, ...configurations)
  }


  /**
   * 启动项目(开发环境)
   *
   * @author yuzhanglong
   * @date 2021-2-3 12:15:09
   */
  public start(): void {
    // 执行 hooks
    this.hooks.beforeWebpackStart.call(this.mergeWebpackConfig.bind(this))
    this.hooks.beforeDevServerStart.call(this.mergeDevServerConfig.bind(this))

    // devServer 选项合并
    this.mergeDevServerConfig(
      this.options.devServerConfig || {}
    )

    // webpack 配置合并
    this.mergeWebpackConfig(
      this.options?.webpackConfig || {}
    )

    // 初始化 webpack compiler 见 webpack node.js API
    // @ts-ignore
    const compiler = webpack(this.webpackConfig)

    // 启动 webpackDevServer 服务器
    const server = new WebpackDevServer(compiler, this.devServerConfig)

    server.listen(
      this.options?.port || DEFAULT_WEBPACK_DEV_SERVER_PORT,
      this.options?.host || DEFAULT_WEBPACK_DEV_SERVER_HOST,
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
    serendipityEnv.setProjectProduction()

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