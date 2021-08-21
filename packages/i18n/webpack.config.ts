import * as webpack from 'webpack';

const env = process.env.NODE_ENV;
const isDev = env === 'development';

const config: webpack.Configuration = {
  entry: './src/index.ts',
  mode: isDev ? 'development' : 'production',
  output: {
    library: {
      name: 'intl',
      type: 'umd',
    },
    filename: `intl.${isDev ? 'development' : 'production'}.js`,
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
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
};

export default config;
