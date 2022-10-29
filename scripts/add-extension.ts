/**
 * 批量添加后缀名
 *
 * @author yuzhanglong
 * @date 2021-10-04 00:27:23
 */
import * as path from 'path';
import * as fs from 'fs-extra';

export const addExtension = (baseDir: string, extension: string) => {
  const res = fs.readdirSync(baseDir);
  for (const re of res) {
    const fileOrDir = path.resolve(baseDir, re);
    if (fs.lstatSync(fileOrDir).isDirectory())
      addExtension(fileOrDir, extension);
    else if (!re.endsWith('.hbs'))
      fs.renameSync(fileOrDir, path.resolve(baseDir, `${re}.${extension}`));
  }
};

addExtension(path.resolve(process.cwd(), 'packages/assets/src/templates'), 'hbs');
