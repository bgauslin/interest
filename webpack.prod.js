const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'interest.[contenthash].js',
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
});
