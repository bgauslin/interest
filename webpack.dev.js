const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: 'interest.js',
  },
  plugins: [
    new CopyPlugin([
      { from: 'src/dev-only' },
    ]),
  ],
  devServer: {
    contentBase: './dist'
  },
});
