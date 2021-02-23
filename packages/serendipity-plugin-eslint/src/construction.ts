/*
 * File: runtime.ts
 * Description: eslint 配置 template plugin
 * Created: 2021-2-4 21:11:13
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


module.exports = (options) => {
  options.mergePackageConfig({
    // eslint 配置
    eslintConfig: {
      'extends': [
        'react-app'
      ]
    }
  })

  // eslint 必要的依赖
  options.mergePackageConfig({
      dependencies: {
        '@typescript-eslint/eslint-plugin': '^4.15.0',
        '@typescript-eslint/parser': '^4.15.0',
        // eslint-config-react-app 并不兼容新的 @babel/eslint-parser
        'babel-eslint': '^10.1.0',
        'eslint': '^7.19.0',
        'eslint-config-react-app': '^6.0.0',
        'eslint-plugin-flowtype': '^5.2.0',
        'eslint-plugin-import': '^2.22.0',
        'eslint-plugin-jest': '^24.0.0',
        'eslint-plugin-jsx-a11y': '^6.3.1',
        'eslint-plugin-react': '^7.22.0',
        'eslint-plugin-react-hooks': '^4.0.8',
        'eslint-plugin-testing-library': '^3.9.0'
      }
    }
  )
}