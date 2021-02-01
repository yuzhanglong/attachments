import { configFile } from '../utils/paths'
import { AppConfig } from '../types/appConfig'
import { CommonObject } from '@attachments/serendipity-public/bin/types/common'
import merge from 'webpack-merge'
import baseConfig from '../webpack/webpackBase'

class ReactService {
  private readonly appConfig: AppConfig
  private webpackConfig: CommonObject

  constructor() {
    this.appConfig = require(configFile)
    this.initWebpackConfig()
  }

  private initWebpackConfig() {
    // 这里是基本的 config
    const baseWebpackConfig = baseConfig

    // 1. TODO:从插件中获取配置
    const webpackConfigFromPlugins = {}

    // 2. 从用户配置文件中获取配置，它的优先级较高
    const webpackConfigFromConfigFile = this.appConfig.webpackConfig

    this.webpackConfig = merge(baseWebpackConfig, webpackConfigFromPlugins, webpackConfigFromConfigFile)

    console.log(this.webpackConfig)
  }

  public start(): void {
    return
  }
}

export default ReactService