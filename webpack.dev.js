const common = require('./webpack.common.js');
const merge = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: 'interest.js',
  },
  devServer: {
    contentBase: './dist'
  },
});
