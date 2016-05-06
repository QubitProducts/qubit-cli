module.exports = {
  devtool: 'source-map',
  entry: {
    app: ['./index', 'webpack-dev-server/client']
  },
  output: {
    path: process.cwd(),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader!less-loader' }
    ]
  },
  devServer: {
    contentBase: process.cwd(),
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
