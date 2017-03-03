var path = require('path')
var webpack = require('webpack')
var cwd = process.cwd()

module.exports = {
  entry: [
    path.join(__dirname, 'src/client/index'),
    'webpack-hot-middleware/client?path=https://localhost:41337/__webpack_hmr&timeout=20000&reload=true&&noInfo=true&&quiet=true'
  ],
  output: {
    path: __dirname,
    publicPath: 'https://localhost:41337/',
    filename: 'bundle.js'
  },
  amd: {
    jQuery: true
  },
  devtool: '#source-map',
  resolve: {
    modules: [cwd, path.join(cwd, 'node_modules'), path.join(__dirname, 'node_modules')]
  },
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')]
  },
  module: {
    loaders: [
      { test: /global\.js$/, loader: 'raw-loader' },
      { test: /(triggers)\.js$/, loader: '@qubit/xp-loader' },
      { test: /\.css$/, loader: 'style-loader/useable!raw-loader!less-loader' },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
