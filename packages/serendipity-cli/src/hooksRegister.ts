/*
 * File: hooksRegister.ts
 * Description: hooks 注册函数集合
 * Created: 2021-3-16 14:56:25
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { CoreManager } from '@attachments/serendipity-core'
import { chalk, logger } from '@attachments/serendipity-public'

export const registerCreateHook = (manager: CoreManager) => {
  const coreManagerHooks = manager.getCoreManagerHooks()
  coreManagerHooks.onCreateStart.tap('beforePluginInstall', (instance) => {
    logger.info(`🚀 在 ${chalk.yellow(instance.getBasePath())} 创建项目中...\n`)
  })

  coreManagerHooks.onCreateSuccess.tap('onRunningSuccess', () => {
    // 成功提示
    logger.done(`✨ 创建项目成功~, happy coding!`)
  })

  coreManagerHooks.onCreateValidateError.tap('onCreateValidateError', () => {
    logger.error('preset 为空，请选择一个正确的 preset，可以是一个本地路径或者 http url')
  })

  coreManagerHooks.onAddStart.tap('onAddStart', ({ name }) => {
    logger.info(`添加插件 ${name} 中...`)
  })

  coreManagerHooks.onAddValidateError.tap('onAddValidateError', ({ name }) => {
    logger.error(`${name} 不是一个合法的插件名称，名称应该以 serendipity-plugin 或者 @attachments/serendipity-plugin 开头`)
  })

  coreManagerHooks.onPluginInstallSuccess.tap('onPluginInstallSuccess', ({ name }) => {
    logger.info(`插件 ${name} 安装成功!`)
  })

  coreManagerHooks.beforePluginDelete.tap('beforePluginDelete', () => {
    logger.info('正在移除无关的依赖...')
  })

  coreManagerHooks.afterPluginDelete.tap('afterPluginDelete', () => {
    logger.info('移除成功!')
  })

  coreManagerHooks.onInitWorkDirFail.tap('onInitWorkDirFail', () => {
    logger.error('该目录已经存在，请删除旧目录或者在其他目录下执行创建命令！')
  })
}