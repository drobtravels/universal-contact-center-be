// NOTE: paths are relative to each functions folder
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  output: {
    path: './lib',
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: [/node_modules/]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },

  resolve: {
    alias: {
      helpers: './../../../helpers'
    },
    extensions: ['', '.js']
  },

  // ignore all modules in node_modules folder
  externals: [nodeExternals()]
};
