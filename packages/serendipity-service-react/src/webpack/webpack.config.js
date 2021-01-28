const path = require('path');

module.exports = (env, argv) => {
  return {
    entry: {
      'pages/index/index': './src/pages/index/index.jsx',
    },
    output: {
      path: path.resolve('build'),
      publicPath: 'build',
      filename: '[name].js',
      chunkFilename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader'
          ],
        },
      ],
    },
  };
};
