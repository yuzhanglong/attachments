/*
 * File: SerendipityReactPlugin.ts
 * Description: React Plugin
 * Created: 2021-2-22 21:59:56
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { Construction, Inquiry, Script, SerendipityPlugin } from '@attachments/serendipity-scripts'
import { ConstructionOptions } from '@attachments/serendipity-scripts/bin/types/pluginExecute'
import { serendipityEnv } from '@attachments/serendipity-public'
import { ReactPluginInquireResult } from '../types/inquiry'
import ReactService from './ReactService'

@SerendipityPlugin('serendipity-react-plugin')
class SerendipityReactPlugin {
  private baseDeps = {}
  private useTypeScript = false

  @Construction()
  createReactProject(options: ConstructionOptions) {
    const inquiryResult = options.inquiryResult as ReactPluginInquireResult
    this.useTypeScript = (inquiryResult.language === 'TypeScript')

    // package.json 配置
    options.appManager.packageManager.mergeIntoCurrent({
      'dependencies': this.getPackageDependence()
    })

    // 拷贝模板 typescript
    options.renderTemplate(this.useTypeScript ? 'react-template-typescript' : 'react-template')
  }

  getPackageDependence() {
    return Object.assign(
      this.baseDeps,
      // 添加 react 相关依赖
      // 理论上这两行不需要加，但是为了方便 IDE 的智能提示（它们会从 package.json）来搜索依赖，故加上它们
      // 不过它们不会被重复安装
      {
        'react': '^17.0.1',
        'react-dom': '^17.0.1'
      },

      // 对于 typescript 项目，需要添加 typescript 相关类型声明
      this.useTypeScript ? {
        '@types/node': '^12.0.0',
        '@types/react': '^17.0.0',
        '@types/react-dom': '^17.0.0',
        'typescript': '^4.1.3'
      } : undefined
    )
  }

  @Inquiry()
  reactProjectInquiry() {
    return [
      {
        type: 'list',
        message: '请选择一个开发语言',
        name: 'language',
        choices: [
          'JavaScript',
          'TypeScript'
        ],
        default: 'JavaScript'
      }
    ]
  }

  @Script('react-start')
  startReactApp() {
    serendipityEnv.setProjectDevelopment()
    const reactService = new ReactService()
    reactService.start()
    return
  }

  @Script('react-build')
  buildReactApp() {
    return
  }
}

export default SerendipityReactPlugin