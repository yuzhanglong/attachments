import * as path from 'path';
import { getModuleFederationExposes } from './get-module-federation-exposes';
import { sourcePath } from './path';
import { FILE_PREFIX, JS_PREFIX } from './const';

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { ModuleFederationPlugin } = require('webpack').container;


const env = process.env.NODE_ENV;
const isProd = env === 'production';

const APP_NAME = 'mf_provider';

const config = {
  mode: isProd ? 'production' : 'development',
  entry: path.resolve(sourcePath, 'index.js'),
  devtool: isProd ? false : 'source-map',
  output: {
    // 输出的文件名称
    filename: `${JS_PREFIX}/[name].[contenthash:8].js`,

    // 输出文件名称，和 fileName 不同，这里的输出文件为非初始（non-initial）文件，例如我们熟悉的路由懒加载
    chunkFilename: `${JS_PREFIX}/[name].[contenthash:8].chunk.js`,

    // asset/resource 模块以 [hash][ext][query] 文件名发送到输出目录
    assetModuleFilename: `${FILE_PREFIX}/[hash][ext][query]`
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: 'all',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: APP_NAME,
      library: {
        type: 'global',
        name: APP_NAME,
      },
      filename: `${APP_NAME}.js`,
      exposes: getModuleFederationExposes([
        'react',
        'react-dom',
        'react-router',
        'react-router-dom',
        'mobx',
        'antd',
        'mobx-react-lite',
      ]),
    }),
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerPort: 13000,
    }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
};

export default config;

