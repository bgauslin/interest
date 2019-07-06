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
    new CopyPlugin([
      { from: 'src/apache' },
      { from: 'src/icons' },
    ]),
    new HtmlWebpackPlugin({
      inject: false,
      template: require('html-webpack-template'),
      lang: 'en',
      title: 'Compount Interest Calculator',
      meta: [
        {
          name: 'description',
          content: 'Mobile-friendly standalone web app that calculates compound interest',
        },
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1',
        },
        {
          name: 'apple-mobile-web-app-capable',
          content: 'yes',
        },
        {
          name: 'apple-mobile-web-app-title',
          content: 'Interest',
        }
      ],
      bodyHtmlSnippet: '<div class="app" id="app"></div>',
    })
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