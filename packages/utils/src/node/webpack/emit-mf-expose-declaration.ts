import * as path from 'path';
import * as fs from 'fs-extra';
import { BundleFileConfig, bundleTsDeclaration } from '../ts-bundle/dts-bundle-generator-wrapper';
import { bundleModuleDeclare } from '../ts-bundle/bundle-module-declare';
import { MicroAppConfig } from './micro-fe-app-config';

/**
 * 供公共组件的提供者使用，用来将相应的类型定义写入某个文件目录下
 * 我们可以在 webpack 写入文件之后 hook 到相应的生命周期中追加内容
 *
 * @author yuzhanglong
 * @date 2021-10-02 14:51:10
 * @param appConfig app 配置
 * @param baseUrl 写入的根路径
 */
export const emitMfExposeDeclaration = async (appConfig: MicroAppConfig, baseUrl: string) => {
  await fs.ensureDir(path.resolve(baseUrl, '.cache'));

  const entries: (BundleFileConfig & { name: string })[] = [];


  for (const expose of appConfig.exposes) {
    // 只处理 module 类型
    if (typeof expose === 'object' && expose.type !== 'package') {
      entries.push({
        name: expose.name,
        entryPath: expose.path,
        outputPath: path.resolve(baseUrl, '.cache', `${expose.name}.d.ts`),
      });
    }
  }

  await bundleTsDeclaration(entries.slice());

  const content = bundleModuleDeclare(entries.map(res => {
    return {
      path: res.outputPath,
      moduleName: `${appConfig.name}/${res.name}`,
    };
  }));

  await fs.writeFile(path.resolve(baseUrl, 'exposes.d.ts'), content);
  await fs.remove(path.resolve(baseUrl, '.cache'));
};
