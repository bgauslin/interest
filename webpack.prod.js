const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'interest.[contenthash].js',
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Compount Interest Calculator',
      meta: {
        'description': 'Mobile-friendly standalone web app that calculates compound interest',
        'viewport': 'width=device-width,initial-scale=1',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-title': 'Interest',
      },
      hash: true
    })
  ],
});
