module.exports = {
  preset: 'ts-jest',
  testMatch: [
    "**/serendipity-public/**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  collectCoverage: false,
  collectCoverageFrom: [
    // packages 子包
    'packages/serendipity-public/**/*.ts',

    // 第三方包文件
    '!**/node_modules/**',

    // 插件模板
    '!**/templates/**',

    // 忽略打包产物
    '!**/bin/**',
    '!**/esm/**',
    '!**/lib/**',

    // 命令行模块不考虑
    '!packages/serendipity-cli/**/*.ts',

    // 插件的测试暂时忽略，未来会单独开一个插件测试的包
    '!packages/serendipity-core/**/*.ts'
  ]
}

