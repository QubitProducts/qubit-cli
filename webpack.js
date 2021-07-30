const path = require('path')
const webpack = require('webpack')

module.exports = function createWebpackConfig () {
  const CWD = process.cwd()
  const BUBLE_LOADER = {
    loader: '@qubit/buble-loader',
    options: {
      objectAssign: 'Object.assign',
      transforms: {
        dangerousForOf: true,
        dangerousTaggedTemplateString: true
      }
    }
  }
  const MANAGED_STYLES = /(placement|variation)[0-9-]*\.(css|less)$/
  return {
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
        // global.js
        {
          test: /global\.js$/,
          use: ['raw-loader']
        },
        // package.json
        {
          test: /\.json$/,
          use: ['json-loader']
        },

        // Import placement and variation styles without injecting
        {
          test: MANAGED_STYLES,
          use: [
            'raw-loader',
            {
              // Add variables to .less files
              loader: 'experience-less',
              options: {
                variationMasterId: true,
                experienceId: true
              }
            },
            'less-loader'
          ]
        },

        // Auto inject package styles
        {
          test: /\.(css|less)$/,
          exclude: [MANAGED_STYLES],
          use: ['style-loader', 'raw-loader', 'less-loader']
        },
        {
          include: [path.join(__dirname, 'src/client/serve-experience.js')],
          use: ['entry']
        },
        // Compile javascript to buble and fix legacy css imports
        {
          test: /\.js$/,
          exclude: [/global\.js/],
          use: ['experience-css', BUBLE_LOADER]
        }
      ]
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ]
  }
}
