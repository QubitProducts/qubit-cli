// NOTE: This file is used to compile experiences, not to compile the xp-cli tool itself.

const path = require('path')
const webpack = require('webpack')

const CWD = process.cwd()
const QUBIT_NODE_MODULES = [
  path.join(CWD, 'node_modules', '@qubit'),
  path.join(__dirname, 'node_modules', '@qubit')
]
const NODE_MODULES = [
  path.join(CWD, 'node_modules'),
  path.join(__dirname, 'node_modules')
]

module.exports = {
  entry: [
    'webpack-hot-middleware/client?path=https://localhost:41337/__webpack_hmr&timeout=20000&reload=true&&noInfo=true&&quiet=true'
  ],
  output: {
    path: CWD,
    publicPath: 'https://localhost:41337/',
    filename: 'bundle.js'
  },
  bail: false,
  amd: { jQuery: true },
  devtool: '#source-map',
  resolve: {
    modules: [
      CWD,
      path.join(CWD, 'node_modules'),
      path.join(__dirname, 'node_modules')
    ],
    mainFields: [ 'browser', 'main' ],
    alias: { jquery: '@qubit/jquery' }
  },
  resolveLoader: {
    modules: [
      path.join(__dirname, 'loaders'),
      path.join(__dirname, 'node_modules')
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: QUBIT_NODE_MODULES,
        loader: 'experience-css'
      },
      {
        test: /\.(css|less)$/,
        include: QUBIT_NODE_MODULES,
        loader: 'style-loader!raw-loader!less-loader'
      },
      { test: /global\.js$/, loader: 'raw-loader' },
      {
        test: /\.js$/,
        include: [ path.join(__dirname, 'src/client') ],
        loader: 'entry!buble-loader?{"objectAssign": "Object.assign", "transforms": { "dangerousForOf": true, "dangerousTaggedTemplateString": true } }'
      },
      {
        test: /\.js$/,
        include: [ CWD ],
        exclude: [ /global\.js/, /node_modules/ ],
        loader: 'experience-js!buble-loader?{"objectAssign": "Object.assign", "transforms": { "dangerousForOf": true, "dangerousTaggedTemplateString": true } }'
      },
      {
        test: /\.(css|less)$/,
        loader: 'raw-loader!less-loader',
        exclude: NODE_MODULES
      },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
