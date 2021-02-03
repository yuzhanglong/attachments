/*
 * File: env.ts
 * Description: 环境配置
 * Created: 2021-2-2 22:43:41
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


// 脚手架开发者使用，判断当前是否为开发环境，便于 部分 jest 测试更加优雅地执行
export const isSerendipityDevelopment = (): boolean => process.env.SERENDIPITY_CONFIG === 'DEVELOPMENT'

// 生产环境
export const isProjectDevelopment = (): boolean => process.env.PROJECT_CONDITION === 'DEVELOPMENT'

// 开发环境
export const isProjectProduction = (): boolean => process.env.PROJECT_CONDITION === 'PRODUCTION'


const serendipityEnv = {
  isSerendipityDevelopment,
  isProjectDevelopment,
  isProjectProduction
}

export default serendipityEnv

