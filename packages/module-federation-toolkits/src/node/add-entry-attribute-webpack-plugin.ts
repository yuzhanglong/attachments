import webpack from 'webpack';
import { Hooks } from 'html-webpack-plugin';

/**
 * 向 html-webpack-plugin 导出的 HTML 模板 script 添加属性
 *
 * @author yuzhanglong
 * @date 2021-10-10 02:31:52
 */
export class AddEntryAttributeWebpackPlugin {
  private readonly entryMatchCallback;

  constructor(matchCallback: (src: string) => boolean) {
    this.entryMatchCallback = matchCallback;
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap('AddEntryAttributeWebpackPlugin', (compilation) => {
      const HtmlWebpackPluginInstance: any = compiler.options.plugins
        .map(({ constructor }) => constructor)
        .find(constructor => constructor && constructor.name === 'HtmlWebpackPlugin');

      if (HtmlWebpackPluginInstance) {
        const hooks = HtmlWebpackPluginInstance.getHooks(compilation) as Hooks;
        hooks.alterAssetTagGroups.tap(
          'AddEntryAttributeWebpackPlugin', (data) => {
            data.headTags.forEach(tag => {
              if (tag.tagName === 'script' && this.entryMatchCallback(tag.attributes?.src)) {
                // eslint-disable-next-line no-param-reassign
                tag.attributes.entry = true;
              }
            });
            return data;
          },
        );
      }
    });
  }
}
