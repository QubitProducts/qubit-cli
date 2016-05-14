var path = require('path')
var webpack = require('webpack')
var cwd = process.cwd()

module.exports = {
  devtool: 'source-map',
  entry: {
    app: [
      path.join(__dirname, 'src/index'),
      'webpack-dev-server/client'
    ]
  },
  output: {
    path: cwd,
    filename: 'bundle.js'
  },
  resolve: {
    root: cwd
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader!less-loader' }
    ]
  },
  devServer: {
    contentBase: cwd,
    compress: true,
    filename: 'bundle.js',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    quiet: true,
    noInfo: false,
    publicPath: '/',
    stats: { colors: true }
  }
}
