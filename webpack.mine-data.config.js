const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './mine-data/index.html',
  filename: 'index.html',
  inject: 'body'
});
const ScriptExtHtmlWebpackPluginConfig = new ScriptExtHtmlWebpackPlugin({
  defaultAttribute: 'defer'
});
const EnvVariablesPlugin = new webpack.DefinePlugin({
  'process.env.API_URL': JSON.stringify(process.env.API_URL || '')
});

module.exports = {
  target: 'web',
  mode: process.env.WEBPACK_MODE || 'production', // 'development' || 'production'
  entry: {
    main: `./mine-data/index.js`
  },
  output: {
    path: path.resolve('./mine-data/build'),
    filename: 'bundle-[hash].js',
    publicPath: '/mine-data'
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(svg|jpg|png|mp4|webm|ico)$/i,
        use: {
          loader: 'file-loader',
          options: { name: '/[name].[ext]' }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(s)?css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig,
    ScriptExtHtmlWebpackPluginConfig,
    EnvVariablesPlugin
  ],
  devtool: 'source-map',
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /\/mine-data\/.*$/, to: '/mine-data' },
        { from: /^\/?$/, to: '/mine-data' }
      ]
    }
  }
};
