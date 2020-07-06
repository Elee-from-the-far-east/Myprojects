const path = require('path');
const html = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
  },
  // devtool: 'eval-source-map',
  devServer: {
    contentBase: './dist'
  },
  plugins: [
      new html({
        filename: 'index.html',
        template: './src/index.html',
      })
  ],
  module: {
    rules: [
        {
          test:/\.m?js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  { useBuiltIns: 'usage', corejs: { version: 3 } }
                ]
              ]
            }

          }
        }
    ]
  },
};
