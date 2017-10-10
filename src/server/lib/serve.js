const createEmitter = require('event-kitten')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpack = require('webpack')
const fs = require('fs-extra')
const chalk = require('chalk')
const webpackConf = require('../../../webpack.conf')
const pickVariation = require('../../lib/pick-variation')
const log = require('../../lib/log')
const createApp = require('../app')
const cors = require('cors')
let CWD = process.cwd()

module.exports = async function serve (options) {
  const app = await createApp()
  app.use(cors())
  options.verbose = options.verbose || false

  if (/(triggers|global|.css$)/.test(options.variationFilename)) {
    log('hint: you should be watching the entry point for your experience, i.e. your variation file!')
  }

  if (!options.variationFilename) {
    options.variationFilename = await pickVariation(await fs.readdir(CWD))

    if (!options.variationFilename) {
      log(chalk.red('ensure you are within an experience directory and try again'))
      return
    }

    log(`using ${options.variationFilename}`)
  }

  // make .js optional
  options.variationFilename = options.variationFilename.replace(/\.js$/, '')

  const verboseOpts = {
    log: options.verbose ? log : false,
    noInfo: !options.verbose,
    quiet: !options.verbose,
    stats: options.verbose,
    warn: options.verbose
  }
  const emitter = createEmitter()
  const compiler = webpack(Object.assign(createWebpackConfig(options)), (plumbus, stats) => {
    if (stats.hasErrors()) log(stats.toString('errors-only').trim())
  })
  compiler.plugin('done', (data) => emitter.emit('rebuild', data))
  app.use(webpackDevMiddleware(compiler, Object.assign({
    publicPath: webpackConf.output.publicPath
  }, verboseOpts)))
  app.use(webpackHotMiddleware(compiler, Object.assign({
    reload: true,
    path: '/__webpack_hmr',
    heartbeat: 100
  }, verboseOpts)))

  return await app.start().then(() => {
    return { app, emitter }
  })
}

function createWebpackConfig (options) {
  const plugins = webpackConf.plugins.slice(0)
  plugins.push(new webpack.DefinePlugin({
    __CWD__: `'${CWD}'`,
    __VARIATION__: `'${options.variationFilename}'`
  }))
  const entry = webpackConf.entry.slice(0)
  return Object.assign({}, webpackConf, {
    entry: entry,
    plugins: plugins
  })
}
