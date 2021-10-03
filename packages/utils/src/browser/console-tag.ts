/**
 * File: console-tag.ts
 * Description: 打印在浏览器终端的小标签，用来展示版本及构建信息
 * Created: 2021-09-28 01:28:44
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */
interface ConsoleTagConfig {
  key: string;
  value: string;
  keyColor?: string;
  valueColor?: string;
}

export const consoleTag = (...config: ConsoleTagConfig[]) => {
  for (const { keyColor, valueColor, value, key } of config) {
    const data = [
      `%c ${key} %c ${value} `,
      `padding: 1px; border-radius: 3px 0 0 3px; color: #fff; background: ${keyColor || '#606060'};`,
      `padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background:  ${valueColor || '#42c02e'}`,
    ];

    console.log(data[0], data[1], data[2]);
  }
};
