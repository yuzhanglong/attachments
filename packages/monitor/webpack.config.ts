import * as webpack from 'webpack';
import HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV;
const isDev = env === 'development';

const config: webpack.Configuration = {
  entry: './src/index.ts',
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'source-map' : false,
  output: {
    library: {
      name: 'Monitor',
      type: 'umd',
    },
    filename: `monitor.min.js`,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
            ],
            plugins: [
              ['@babel/plugin-transform-runtime'],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    isDev && new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
};

export default config;
