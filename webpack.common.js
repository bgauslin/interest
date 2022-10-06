const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    interest: './src/js/interest.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([
      { from: 'src/root' },
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/html/index.html',
    }),
  ],
  module: {
    rules: [
    ]
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
}