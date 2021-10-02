/**
 * 生成 module federation expose 声明，一般用于消费者调用
 *
 * @author yuzhanglong
 * @date 2021-10-02 14:53:24
 */
import axios from 'axios';
import * as url from 'url';
import * as fs from 'fs-extra';
import * as path from 'path';
import { MicroAppConfig } from './micro-fe-app-config';
import { sourcePath } from '../../common/paths';

export const generateMfExposeDeclaration = async (appConfig: MicroAppConfig) => {
  const typeRoot = path.resolve(sourcePath, 'types');
  await fs.ensureDir(typeRoot);

  for (const { name, url: remoteUrl } of appConfig.remotes) {
    const targetFileName = `${name}-exposes.d.ts`;
    // example: https://base-40kkvlqeq-yzl.vercel.app/types/exposes.d.ts
    const declarations = await axios.get(url.resolve(remoteUrl, 'types/exposes.d.ts'));
    await fs.writeFile(path.resolve(typeRoot, targetFileName), declarations.data);
  }
};
