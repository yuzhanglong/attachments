import HtmlWebpackPlugin = require('html-webpack-plugin');

const { ModuleFederationPlugin } = require('webpack').container;

const config = {
  mode: 'development',
  entry: './example/index.js',
  devtool: 'source-map',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: 'all',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "example",
      remotes: {
        'mf_provider': 'mf_provider@//localhost:9000/mf_provider.js',
      },
    }),
    new HtmlWebpackPlugin(),
  ].filter(Boolean),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
};

export default config;

