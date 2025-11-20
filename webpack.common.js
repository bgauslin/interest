const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const FontPreloadPlugin = require('webpack-font-preload-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    app: './src/js/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'src/root' },
      ],
    }),
    new FontPreloadPlugin({
      index: 'index.html',
      insertBefore: 'link:first-of-type',
      loadType: 'prefetch',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        // Encapsulated shadow DOM styles in web components.
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src/js/components')
        ],
        use: [
          'lit-css-loader',
          {
            // Files are plain CSS but we're using Sass simply to minify the
            // shadow DOM stylesheet in each web component.
            // TODO(build): Replace sass and sass-loader.
            loader: 'sass-loader',
            options: {
              api: 'modern',
              sassOptions: {
                outputStyle: 'compressed',
              },
            },
          },
        ],
      },
      {
        // App light DOM styles.
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src/styles')
        ],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.css'],
  },
}