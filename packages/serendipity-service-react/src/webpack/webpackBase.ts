/*
 * File: webpackBase.ts
 * Description: webpack 基础配置
 * Created: 2021-2-2 00:54:46
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import { appBuild, appEntry, appHtml } from '../utils/paths'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import { WebpackConfiguration } from '@attachments/serendipity-public/bin/types/common'
import { serendipityEnv } from '@attachments/serendipity-public'
import * as webpack from 'webpack'

const WebpackBar = require('webpackbar')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')


// TODO: 有选择地抽离一些配置到 react-plugin 中

const getBaseConfig = (): WebpackConfiguration => {

  const getHtmlWebpackPluginOptions = (): HtmlWebpackPlugin.Options => {

    const base = {}
    return Object.assign(
      base,

      // 公共配置
      {
        inject: true,
        template: appHtml
      } as HtmlWebpackPlugin.Options,

      // 生产环境的额外配置
      serendipityEnv.isProjectProduction() ? {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        } as HtmlWebpackPlugin.MinifyOptions
      } : undefined
    )
  }

  return {
    // 项目入口
    entry: appEntry,

    // 项目环境
    mode: serendipityEnv.isProjectDevelopment() ? 'development' : 'production',

    // 输出配置
    output: {
      // 输出的文件名称
      filename: serendipityEnv.isProjectDevelopment() ? '[name].js' : '[name].[contenthash:8].js',

      // 打包路径
      path: appBuild,

      // 输出文件名称，和 fileName 不同，这里的输出文件为非初始（non-initial）文件，例如我们熟悉的路由懒加载
      chunkFilename: serendipityEnv.isProjectDevelopment() ? '[name].chunk.js' : '[name].[contenthash:8].chunk.js',


      // 公共路径，默认为 '/' . 用户可以在配置文件中覆盖此配置，这对部署 cdn 等操作十分有效
      publicPath: '/',

      // @ts-ignore -- 这个特性为 v5 新特性，@types/webpack 并没有迁移到 v5
      // asset/resource 模块以 [hash][ext][query] 文件名发送到输出目录
      assetModuleFilename: 'assets/[hash][ext][query]'
    },

    // 在开发环境中使用 source-map
    devtool: serendipityEnv.isProjectDevelopment() ? 'source-map' : false,

    // 性能优化
    optimization: {
      minimize: serendipityEnv.isProjectProduction(),

      // TODO: 内部细节配置，做性能优化
      minimizer: [
        new TerserPlugin(),
        new CssMinimizerPlugin()
      ],

      splitChunks: {
        // 选择哪些块进行优化, 提供 all 味着即使在异步和非异步块之间也可以共享块
        chunks: 'all',

        // 自定义拆分块的名称，webpack 默认配置即可
        name: false,


        cacheGroups: {
          // 默认配置下的入口 vendor 名字又臭又长，这里对齐作出修改，通过 hash 值来保证不会冲突
          defaultVendors: {
            filename: (pathData): string => {
              return `vendor-${pathData.hash}.js`
            }
          } as unknown
        }
      },

      // 配置 runtimeChunk 名称
      runtimeChunk: {
        name: (entrypoint) => {
          return `runtime-${entrypoint.name}`
        }
      }
    },

    // 配置插件
    plugins: [
      // html 模板（基于 public 目录）
      new HtmlWebpackPlugin(getHtmlWebpackPluginOptions()),

      // webpack 进度条
      new WebpackBar({
        basic: false
      }),

      // HotModuleReplacementPlugin 热更新处理，如果你在 devServer 配置中设置 hot = true, 它也会被自动加载
      serendipityEnv.isProjectDevelopment() && new webpack.HotModuleReplacementPlugin(),

      // 官方的 react 热更新 webpack 插件
      serendipityEnv.isProjectDevelopment() && new ReactRefreshWebpackPlugin()

      // TODO: 开发环境 plugin 例如 eslint plugin 等
    ].filter((e) => e),


    // 该选项决定了如何处理项目中的不同类型的模块
    // 项目基于 webpack 5 我们不采用 url-loader / raw-loader / file-loader 之类的配置
    // 可参考：https://webpack.js.org/guides/asset-modules/
    module: {
      rules: [
        {
          oneOf: [
            // 对于图片、动画等静态资源，我们直接返回路径 url 而不执行额外的转化
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],

              // @ts-ignore -- 这个特性为 v5 新特性，@types/webpack 并没有迁移到 v5
              type: 'asset/resource'
            },

            // 使用 node-sass
            {
              test: [/\.sass$/],
              use: [
                // 将所有的计算后的样式加入页面中
                'style-loader',

                // 编译 css 代码
                'css-loader',

                // sass to css
                'sass-loader'
              ]
            },

            // 基本 css
            {
              test: [/\.css$/],
              use: [
                // 将所有的计算后的样式加入页面中
                'style-loader',

                // 编译 css 代码
                'css-loader'
              ]
            }

            // 未考虑到的资源统一 转化成 uri
            // TODO: 暂时注释掉：处理方法是使用 exclude 属性 但现在不能确定在用户配置合并进来时会发生什么结果，需要实践验证
            // {
            //   exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            //   options: {
            //     name: '.......',
            //   },
            // },
          ]
        }
      ]
    }
  }
}

export default getBaseConfig

