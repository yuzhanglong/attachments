/*
 * File: hooksRegister.ts
 * Description: hooks 注册函数集合
 * Created: 2021-3-16 14:56:25
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { chalk, logger } from '@attachments/serendipity-public'

export const registerCreateHook = (coreManagerHooks: any) => {
  coreManagerHooks.onCreateStart.tap('beforePluginInstall', (instance) => {
    logger.info(`🚀 在 ${chalk.yellow(instance.projectDir)} 创建项目中...\n`)
  })

  coreManagerHooks.onCreateSuccess.tap('onRunningSuccess', () => {
    // 成功提示
    logger.done(`✨ 创建项目成功~, happy coding!`)
  })
}
