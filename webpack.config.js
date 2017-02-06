var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
    },
    {
      test: /\.scss$/,
      exclude: '/node_modules/',
      use: ExtractTextPlugin.extract({
        loader: ['style-loader', 'css-loader', 'sass-loader'],
      })
    },
    {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: "file-loader"
    }]
  },

  plugins: [
    new ExtractTextPlugin("styles.css"),
  ],

  devServer: {
    host: 'localhost',
    port: 8080,
    contentBase: __dirname + '/app'
  },

  devtool: 'cheap-eval-source-map'
};