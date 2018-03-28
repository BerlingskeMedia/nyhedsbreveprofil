const path = require('path');
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

const entry = 'index.js';

module.exports = {
  entry: [
    'babel-polyfill',
    `./mine-data/${entry}`
  ],
  output: {
    path: path.resolve('./mine-data/build'),
    filename: 'bundle-[hash].js',
    publicPath: '/mine-data'
  },
  module: {
    loaders: [
      {
        test: /\.js(x)?$/, loader: 'babel-loader', exclude: /node_modules/
      },
      {
        test: /\.(svg|jpg|png|mp4|webm|ico)$/i, loader: 'file-loader', exclude: /node_modules/,
        options: {name: '[name].[ext]'}
      },
      {
        test: /\.(s)?css$/,
        use: [{loader: 'style-loader'}, {loader: 'css-loader'}, {loader: 'sass-loader'}]
      }
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig,
    ScriptExtHtmlWebpackPluginConfig
  ],
  devtool: 'source-map',
  devServer: {
    historyApiFallback: {
      rewrites: [
        {from: /\/mine-data\/.*$/, to: '/mine-data'},
        {from: /^\/?$/, to: '/mine-data'}
      ]
    }
  }
};
