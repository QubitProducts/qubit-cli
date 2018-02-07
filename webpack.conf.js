// NOTE: This file is used to compile experiences, not to compile the xp-cli tool itself.

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
  bail: false,
  amd: {
    jQuery: true
  },
  devtool: '#source-map',
  resolve: {
    modules: [cwd, path.join(cwd, 'node_modules'), path.join(__dirname, 'node_modules')],
    mainFields: ['browser', 'main'],
    alias: {
      jquery: '@qubit/jquery'
    }
  },
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules'), path.join(__dirname, 'loaders')]
  },
  module: {
    loaders: [
      { test: /\.js$/, include: [path.join(__dirname, 'node_modules', '@qubit')], loader: 'experience-css' },
      { test: /\.css$/, include: [path.join(__dirname, 'node_modules', '@qubit')], loader: 'style-loader!raw-loader!less-loader' },
      { test: /global\.js$/, loader: 'raw-loader' },
      { test: /index\.js$/, include: [path.join(__dirname, 'src/client')], loader: 'entry!buble-loader?{"objectAssign": "Object.assign", "transforms": { "dangerousForOf": true, "dangerousTaggedTemplateString": true } }' },
      { test: /\.js$/, include: [cwd], exclude: [/global\.js/, /node_modules/], loader: 'experience-js!buble-loader?{"objectAssign": "Object.assign", "transforms": { "dangerousForOf": true, "dangerousTaggedTemplateString": true } }' },
      { test: /\.css$/, loader: 'raw-loader!less-loader', exclude: [path.join(__dirname, 'node_modules')] },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
