/*
 * File: env.ts
 * Description: 环境配置
 * Created: 2021-2-2 22:43:41
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

// 脚手架开发者使用，判断当前是否为开发环境，便于 jest 测试更加优雅地执行
export const isSerendipityDevelopment = (): boolean => process.env.SERENDIPITY_CONFIG === 'DEVELOPMENT'

const serendipityEnv = {
  isSerendipityDevelopment
}

export default serendipityEnv

