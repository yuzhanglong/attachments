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
    compiler.hooks.afterEmit.tap('MyPlugin', async (compilation) => {
      // 判断是否是 serve 模式
      // TODO: 这样做不一定优雅，但是 ROI 不大，后期有机会再改
      const isServe = process.argv.some(res => res === 'serve');
      if (!isServe && config) {
        const { outputPath } = compilation.compiler;
        const target = path.resolve(outputPath, 'types');
        await emitMfExposeDeclaration(config, target);
      }
    });
  }
}
