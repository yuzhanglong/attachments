import * as path from 'path';
import * as fs from 'fs-extra';
import { sourcePath } from '../common/paths';
import { BundleFileConfig, bundleTsDeclaration } from '../ts-bundle/dts-bundle-generator-wrapper';
import { bundleModuleDeclare } from '../ts-bundle/bundle-module-declare';
import { MicroAppConfig } from './micro-fe-app-config';

export const generateMfExposeDeclaration = async (appConfig: MicroAppConfig) => {
  const typesRoot = path.resolve(sourcePath, 'types');

  await fs.ensureDir(path.resolve(typesRoot, '.cache'));

  const entries: (BundleFileConfig & { name: string })[] = [];


  for (const expose of appConfig.exposes) {
    // 只处理 module 类型
    if (typeof expose === 'object' && expose.type !== 'package') {
      entries.push({
        name: expose.name,
        entryPath: expose.path,
        outputPath: path.resolve(typesRoot, '.cache', `${expose.name}.d.ts`),
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

  await fs.writeFile(path.resolve(typesRoot, 'exposes.d.ts'), content);
  await fs.remove(path.resolve(typesRoot, '.cache'));
};
