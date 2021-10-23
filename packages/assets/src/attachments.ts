#!/usr/bin/env node

import { program } from 'commander';
import { launchPlopByConfig } from './utils';

// 版本信息
program.version(`attachments ${require('../package').version}`);

// serendipity create，创建一个由 serendipity 管理的项目
program
  .command('generate [template-name]')
  .description('初始化一个项目模板')
  .action(async (name: string) => {
    if (name === 'ts') {
      await launchPlopByConfig('ts-project-generator');
    } else if (name === 'micro-fe') {
      await launchPlopByConfig('micro-fe-generator');
    } else {
      console.log('没有这个模板呜呜呜~');
    }
  });

program.parse(process.argv);
