var path = require('path');

module.exports = {
    entry: './app/js/app.js',
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'app')
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },

    devServer: {
        host: 'localhost',
        port: 8080,
        contentBase: __dirname + '/app'
    }
};