import type webpack from 'webpack';
import TerserWebpackPlugin from 'terser-webpack-plugin';

const env = process.env.NODE_ENV;
const isDev = env === 'development';

const config: webpack.Configuration = {
  entry: './src/index.ts',
  mode: isDev ? 'development' : 'production',
  devtool: false,
  output: {
    library: {
      name: 'Monitor',
      type: 'umd',
    },
    filename: isDev ? 'monitor.js' : 'monitor.min.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
            plugins: ['@babel/plugin-transform-runtime', 'lodash'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
};

export default config;
