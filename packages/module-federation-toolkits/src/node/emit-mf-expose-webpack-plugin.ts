import webpack from 'webpack';
import * as path from 'path';
import { MicroAppConfig } from './micro-fe-app-config';
import { emitMfExposeDeclaration } from './emit-mf-expose-declaration';

/**
 * 向 build 打包产物注入类型定义的 webpack-plugin
 *
 * @author yuzhanglong
 * @date 2021-10-03 19:31:02
 */
export class EmitMfExposeWebpackPlugin {
  private readonly config: MicroAppConfig;

  constructor(config: MicroAppConfig) {
    this.config = config;
  }

  apply(compiler: webpack.Compiler) {
    // @ts-ignore
    const config = this.config;
    compiler.hooks.afterEmit.tap('EmitMfExposeWebpackPlugin', async (compilation) => {
      // NOTICE: 注意，这个插件最好只在 build 模式下跑，否则性能会很差
      if (config) {
        const { outputPath } = compilation.compiler;
        const target = path.resolve(outputPath, 'types');
        await emitMfExposeDeclaration(config, target);
      }
    });
  }
}
