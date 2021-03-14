/*
 * File: PluginConstructorTester.ts
 * Description: plugin tester
 * Created: 2021-3-14 15:48:14
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { CommonObject, Constructor, InquiryResult } from '../../types/common'
import AppManager from '../appManager'
import PluginFactory from '../pluginFactory'

class PluginConstructorTester {
  private pluginFactory: PluginFactory
  private inquiryResult: InquiryResult

  constructor(pluginConstructor: Constructor) {
    this.pluginFactory = new PluginFactory({
      requireResult: pluginConstructor
    })
  }

  inquiry(inquiry: InquiryResult) {
    this.inquiryResult = inquiry
    return this
  }

  match() {
    return
  }

  render() {
    return
  }

  async testConstructionPackageJson(pkgConfig: CommonObject) {
    const metaData = this.pluginFactory.getPluginMetaData()
    const appManager = new AppManager(process.cwd(), {}, {})
    for (const construction of metaData.constructions) {
      await this.pluginFactory.getPluginInstance()[construction.methodName]({
        appManager: appManager,
        matchPlugin: this.match.bind(this),
        inquiryResult: this.inquiryResult,
        renderTemplate: this.render.bind(this)
      })
    }
    expect(appManager.getPackageConfig()).toStrictEqual(pkgConfig)
    return this
  }
}

export default PluginConstructorTester