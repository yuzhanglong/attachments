/*
 * File: commitLint.js
 * Description: CommitLint 配置
 * Created: 2021-2-15 22:07:41
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern: /^(?::\w*:\s)?(?<type>\w*)(?:\((?<scope>.*)\))?!?:\s(?<subject>(?:(?!#).)*(?:(?!\s).))\s?(?<ticket>#\d*)?$/,
      headerCorrespondence: ['type', 'scope', 'subject', 'ticket']
    }
  },
  rules: {
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 72],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always', [
        'build',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'chore'
      ]
    ]
  }
}