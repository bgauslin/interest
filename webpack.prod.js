const common = require('./webpack.common.js');
const {merge} = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[contenthash].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[contenthash].css',
    }),
  ],
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin({
  //       extractComments: false,
  //       terserOptions: {
  //         mangle: true,
  //         output: {
  //           comments: false,
  //         },
  //       }
  //     })
  //   ],
  // },
});
