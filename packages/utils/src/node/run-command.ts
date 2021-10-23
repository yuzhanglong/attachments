/**
 * File: run-command.ts
 * Description: 执行命令
 * Created: 2021-10-01 19:56:40
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import execa from 'execa';

export const runCommand = async (command: string, args?: string[], path?: string): Promise<execa.ExecaChildProcess> => {
  let p = path;
  if (!p) {
    p = process.cwd();
  }
  if (!args) {
    // \s 匹配任何空白字符，包括空格、制表符、换页符
    // eslint-disable-next-line no-param-reassign
    [command, ...args] = command.split(/\s+/);
  }

  return execa(command, args, {
    cwd: p,
    stdio: 'inherit',
  });
};
