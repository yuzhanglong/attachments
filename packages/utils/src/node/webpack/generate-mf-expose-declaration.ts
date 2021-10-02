import * as path from 'path';
import * as fs from 'fs-extra';
import { BundleFileConfig, bundleTsDeclaration } from '../ts-bundle/dts-bundle-generator-wrapper';
import { bundleModuleDeclare } from '../ts-bundle/bundle-module-declare';
import { MicroAppConfig } from './micro-fe-app-config';

export const generateMfExposeDeclaration = async (appConfig: MicroAppConfig, baseUrl: string) => {
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
