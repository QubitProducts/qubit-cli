module.exports = {
  entry: {
    app: ['./index', 'webpack-dev-server/client']
  },
  output: {
    path: process.cwd(),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' }
    ]
  }
}
