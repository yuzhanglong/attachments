import { configFile } from '../utils/paths'
import { AppConfig } from '../types/appConfig'
import merge from 'webpack-merge'
import baseConfig from '../webpack/webpackBase'
import { Configuration, webpack } from 'webpack'
import { PluginModule } from '@attachments/serendipity-public/bin/types/plugin'
import logger from '@attachments/serendipity-public/bin/utils/logger'
import * as WebpackDevServer from 'webpack-dev-server'
import devServerConfig from '../webpack/devServer'

class ReactService {
  private readonly appConfig: AppConfig
  private readonly devServerConfig: unknown

  private webpackConfig: Configuration

  constructor() {
    this.appConfig = require(configFile)
    this.webpackConfig = baseConfig
    this.devServerConfig = devServerConfig
    // test
    this.start()
  }

  private mergeWebpackConfig(...configurations: Configuration[]): void {
    this.webpackConfig = merge(this.webpackConfig, ...configurations)
  }


  private runPlugins(): void {
    if (Array.isArray(this.appConfig.plugins)) {
      for (const plugin of this.appConfig.plugins) {
        const pluginModule: PluginModule = require(plugin)
        pluginModule.runtime({
          mergeWebpackConfig: this.mergeWebpackConfig.bind(this)
        })
      }
    }
  }

  public start(): void {
    // 执行插件逻辑
    this.runPlugins()

    // 从用户配置文件中获取配置，它的优先级较高
    this.mergeWebpackConfig(this.appConfig.webpackConfig)


    const compiler = webpack(this.webpackConfig)

    const devServerOptions = Object.assign({}, this.devServerConfig, {
      open: true
    })

    const server = new WebpackDevServer(compiler, devServerOptions)

    server.listen(8080, '127.0.0.1', () => {
      logger.done('the server is running successfully~')
    })
  }
}

export default ReactService