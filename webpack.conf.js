var path = require('path')
var webpack = require('webpack')
var cwd = process.cwd()

module.exports = {
  contentBase: cwd,
  entry: [
    path.join(__dirname, 'src/client/index'),
    'webpack-hot-middleware/client?path=https://localhost:41337/__webpack_hmr&timeout=20000&reload=true&warn=false&noInfo=true'
  ],
  output: {
    path: __dirname,
    publicPath: 'https://localhost:41337/',
    filename: 'bundle.js'
  },
  amd: { jQuery: true },
  devtool: '#source-map',
  resolve: {
    root: [cwd, path.join(cwd, 'node_modules'), path.join(__dirname, 'node_modules')]
  },
  module: {
    loaders: [
      { test: /(triggers)\.js$/, loader: 'xp-loader' },
      { test: /global\.js$/, loader: 'script' },
      { test: /\.css$/, loader: 'style!raw!less' },
      { test: /\.json$/, loader: 'json' }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}
