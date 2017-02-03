var path = require('path');

module.exports = {
    entry: './app/js/app.js',
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'app')
    }
};