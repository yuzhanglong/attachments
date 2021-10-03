import webpack from 'webpack';
import * as path from 'path';
import { MicroAppConfig } from './micro-fe-app-config';
import { emitMfExposeDeclaration } from './emit-mf-expose-declaration';

export class EmitMfExposeWebpackPlugin {
  private readonly config: MicroAppConfig;

  constructor(config: MicroAppConfig) {
    this.config = config;
  }

  apply(compiler: webpack.Compiler) {
    // @ts-ignore
    const config = this.config;
    compiler.hooks.afterEmit.tap('EmitMfExposeWebpackPlugin', async (compilation) => {
      // 注意，这个插件最好只在 build 模式下跑，否则性能会很差
      if (config) {
        const { outputPath } = compilation.compiler;
        const target = path.resolve(outputPath, 'types');
        await emitMfExposeDeclaration(config, target);
      }
    });
  }
}
