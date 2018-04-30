const fs = require('fs-extra')
const chalk = require('chalk')
const webpack = require('webpack')
const createEmitter = require('event-kitten')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const pickVariation = require('../../lib/pick-variation')
const webpackConf = require('../../../webpack.conf')
const config = require('../../../config')
const log = require('../../lib/log')
const createApp = require('../app')
const commonCodeWarning = require('../../lib/common-code-warning')
const cssCodeWarning = require('../../lib/css-code-warning')
const cors = require('cors')
const { STYLE_EXTENSION } = require('../../constants')
let CWD = process.cwd()

module.exports = async function serve (options) {
  const app = await createApp()

  app.use(cors())
  options.verbose = options.verbose || false

  if (/(triggers|global|\.less|\.css$)/.test(options.variationFilename)) {
    log.info('Hint: you should be watching the entry point for your experience, i.e. your variation file!')
  }

  await commonCodeWarning(CWD)
  await cssCodeWarning(CWD)

  if (!options.variationFilename) {
    options.variationFilename = await pickVariation(await fs.readdir(CWD))

    if (!options.variationFilename) {
      return log.warn('Ensure you are within an experience directory and try again')
    }
  }

  // make .js optional
  options.variationFilename = options.variationFilename.replace(/\.js$/, '')

  const verboseOpts = {
    log: options.verbose ? console.log : false,
    noInfo: !options.verbose,
    quiet: !options.verbose,
    stats: options.verbose ? 'normal' : false,
    warn: options.verbose
  }

  const emitter = createEmitter()
  const compile = new Promise(async resolve => {
    const compiler = webpack(Object.assign(createWebpackConfig(options)), (plumbus, stats) => {
      resolve()
      if (stats.hasErrors() && !options.verbose) log.error(chalk.red(stats.toString('errors-only').trim()))
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
  })

  // Wait for initial compilation
  app.use((req, res, next) => compile.then(next))

  return app.start().then(() => {
    log.info(`Using ${options.variationFilename}`)
    log.info(`Qubit-CLI listening on port ${config.port}`)
    return { app, emitter }
  })
}

function createWebpackConfig (options) {
  const plugins = webpackConf.plugins.slice(0)
  plugins.push(new webpack.DefinePlugin({
    __VARIATION__: `'${options.variationFilename}'`,
    __VARIATION_STYLE_EXTENSION__: `'${STYLE_EXTENSION}'`
  }))
  const entry = webpackConf.entry.slice(0)
  return Object.assign({}, webpackConf, {
    entry: entry,
    plugins: plugins
  })
}
