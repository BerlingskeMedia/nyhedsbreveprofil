var path = require('path');

module.exports = {
    target: 'web',
    entry: path.join(__dirname, 'opdatering/src/main.js'),
    // entry: ['babel-core', path.join(__dirname, 'opdatering/src/main.js')],
    output: {
        path: path.join(__dirname, 'opdatering/build'),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.json$/, loader: 'json-loader' },
            { test: path.join(__dirname, 'opdatering/src'), loader: 'babel-loader', query: { presets: ['react', 'es2015'] } }
        ]
    }
};