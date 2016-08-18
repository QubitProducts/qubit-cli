var path = require('path')
var cwd = process.cwd()

module.exports = {
  devtool: 'source-map',
  entry: [
    path.join(__dirname, 'src/client/index'),
    'webpack-dev-server/client'
  ],
  output: {
    path: cwd,
    filename: 'bundle.js'
  },
  resolve: {
    root: [cwd, path.join(__dirname, 'node_modules')]
  },
  module: {
    loaders: [
      { test: /(triggers)\.js$/, loader: 'xp-loader' },
      { test: /global\.js$/, loader: 'script' },
      { test: /\.css$/, loader: 'style!css!less' },
      { test: /\.json$/, loader: 'json' }
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
