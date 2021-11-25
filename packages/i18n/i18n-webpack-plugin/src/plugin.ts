/**
 * File: plugin.ts
 * Description: I18nWebpackPlugin
 * Created: 2021-08-04 23:38:06
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { Compiler } from 'webpack';

const PLUGIN_NAME = 'I18nWebpackPlugin';

export class I18nWebpackPlugin {
  apply(compiler: Compiler) {
    const { SourceMapSource } = compiler.webpack.sources;
    const allKeyMaps: Map<string, any> = new Map<string, boolean>();

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          additionalAssets: true,
        },
        (compilationAssets) => {
          const compilationAssetsKeys = Object.keys(compilationAssets);

          const assetsForAnalysis = compilationAssetsKeys.map((item) => {
            const { info, source } = compilation.getAsset(item);
            // TODO: 使用 cache 以提高性能
            return {
              name: item,
              info: info,
              source: source,
            };
          });

          const regex = /\/\* i18n-key-to-compress: "(.+?)" \*\//g;

          for (const asset of assetsForAnalysis) {
            const { source, name } = asset;
            // 忽略 .map 之类的文件
            if (name.endsWith('.js')) {
              const code = source.source();
              // 忽略二进制的 buffer，提高效率，intl 字符串只会在非二进制形式的代码中出现
              if (code && typeof code === 'string') {
                const result = code.match(regex);
                if (result) {
                  for (let item of result) {
                    const key = code.match(regex).pop().split(regex)[1];
                    // 使用 map 性能相比 Array 会更好
                    if (!allKeyMaps.has(key)) {
                      allKeyMaps.set(key, true);
                    }
                  }
                }
              }
            }
          }
        }
      );

      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
          additionalAssets: true,
        },
        (compilationAssets) => {
          console.log(allKeyMaps);
          const compilationAssetsEntries = Object.entries(compilationAssets);
          for (const [key, value] of compilationAssetsEntries) {
            // console.log(value.source());
          }
        }
      );
    });

    // make hooks, 在 compilation 结束之前执行
    // compiler.hooks.make.tap('make', (compilation) => {
    //   // 处理资源的 hook
    //   compilation.hooks.processAssets.tap(PLUGIN_NAME, (assets) => {
    //     for (const [k, v] of Object.entries(assets)) {
    //       if (k.startsWith('i18n')) {
    //         const { children } = (v as any).listMap();
    //         for (const child of children) {
    //           const code: string = child.generatedCode;
    //           const matchRes = code.match(/(JSON.parse\(')(.*)('\))/);
    //           if (matchRes) {
    //             child.generatedCode = this.transformSource(matchRes);
    //           }
    //         }
    //       }
    //     }
    //   });
    // });
  }

  // transformSource(source: RegExpMatchArray) {
  //   // 匹配到的第三位(index = 2)为具体内容
  //   const content = source[2];
  //   // 将结果转换成对象以供转换
  //   const intlObj = JSON.parse(content);
  //   const result = {};
  //   for (const item of this.mapOldKeysToCurrentKey.entries()) {
  //     const [oldKey, newKey] = item;
  //     const valueInChunk = intlObj[oldKey];
  //     if (valueInChunk) {
  //       result[newKey] = valueInChunk;
  //     }
  //   }
  //   return `module.exports = JSON.parse('${JSON.stringify(result)}');`;
  // }
}
