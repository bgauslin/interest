const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/interest.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Compount Interest Calculator',
      meta: {
        'description': 'Mobile-friendly standalone web app that calculates compound interest',
        'viewport': 'width=device-width,initial-scale=1',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-title': 'Interest',
      },
    }),
    new CopyPlugin([
      { from: 'src/apache' },
      { from: 'src/icons' },
      { from: 'src/json' },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/, 
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'stylus-loader',
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  }
}