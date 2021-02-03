/*
 * File: env.ts
 * Description: 环境配置
 * Created: 2021-2-2 22:43:41
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


interface SerendipityEnv extends NodeJS.ProcessEnv {
  SERENDIPITY_CONFIG: 'DEVELOPMENT' | 'PRODUCTION'
  PROJECT_CONDITION: 'DEVELOPMENT' | 'PRODUCTION'
}

const __processEnv__: SerendipityEnv = process.env as SerendipityEnv


// 脚手架开发者使用，判断当前是否为开发环境，便于 部分 jest 测试更加优雅地执行
export const isSerendipityDevelopment = (): boolean => __processEnv__.PROJECT_CONDITION === 'DEVELOPMENT'

// 生产环境
export const isProjectDevelopment = (): boolean => __processEnv__.PROJECT_CONDITION === 'DEVELOPMENT'

// 开发环境
export const isProjectProduction = (): boolean => __processEnv__.PROJECT_CONDITION === 'PRODUCTION'


export const setProjectDevelopment = (): void => {
  __processEnv__.PROJECT_CONDITION = 'DEVELOPMENT'
}

export const setProjectProduction = (): void => {
  __processEnv__.PROJECT_CONDITION = 'PRODUCTION'
}

const serendipityEnv = {
  isSerendipityDevelopment,
  isProjectDevelopment,
  isProjectProduction,
  setProjectDevelopment,
  setProjectProduction
}

export default serendipityEnv

