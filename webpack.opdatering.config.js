var path = require('path');

module.exports = {
  target: 'web',
  mode: process.env.WEBPACK_MODE || 'production', // 'development' || 'production'
  entry: {
    main: './opdatering/src/main.js'
  },
  output: {
    path: path.join(__dirname, 'opdatering/build'),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: {
          loader: 'style!css'
        }
      },
      {
        test: /\.json$/,
        use: {
          loader: 'json-loader'
        }
      },
      {
        test: path.join(__dirname, 'opdatering/src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      }
    ]
  }
};
