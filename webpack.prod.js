const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'interest.[contenthash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/html/index.pug',
    })
  ]
});
