const path = require('path')
const _ = require('lodash')
const fs = require('fs-extra')
const chalk = require('chalk')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const pickVariation = require('../../lib/pick-variation')
const webpackConf = require('../../../webpack.conf')
const config = require('../../../config')
const log = require('../../lib/log')
const createApp = require('../app')
const globalCodeWarning = require('../../lib/global-code-warning')
const commonCodeWarning = require('../../lib/common-code-warning')
const cssCodeWarning = require('../../lib/css-code-warning')
const installQubitDeps = require('../../lib/install-qubit-deps')
const getPkg = require('../../lib/get-pkg')
const cors = require('cors')
const { STYLE_EXTENSION, CLIENT_PATH } = require('../../constants')
let CWD = process.cwd()

module.exports = async function serve (options) {
  await installQubitDeps()
  const app = await createApp()

  app.use(cors())
  options.verbose = options.verbose || false

  if (/(triggers|global|\.less|\.css$)/.test(options.fileName)) {
    log.info('Hint: you should be watching the entry point for your experience, i.e. your variation file!')
  }

  options.isPreScript = _.get(await getPkg(), 'meta.isPreScript')

  if (options.isPreScript) {
    options.fileName = 'pre'
  } else {
    await globalCodeWarning(CWD)
    await commonCodeWarning(CWD)
    await cssCodeWarning(CWD)

    if (!options.fileName) {
      options.fileName = await pickVariation(await fs.readdir(CWD))

      if (!options.fileName) {
        return log.warn('Ensure you are within an experience directory and try again')
      }
    }

    // make .js optional
    options.fileName = options.fileName.replace(/\.js$/, '')
  }

  const verboseOpts = {
    log: options.verbose ? console.log : false,
    noInfo: !options.verbose,
    quiet: !options.verbose,
    stats: options.verbose ? 'normal' : false,
    warn: options.verbose
  }

  const compiler = webpack(createWebpackConfig(options))

  compiler.plugin('done', stats => {
    if (!options.verbose && stats.hasErrors()) {
      const token = `Can't resolve '`
      const errors = stats.toString('errors-only').trim()
      if (errors && errors.includes(token)) {
        const pkg = errors.substring(errors.indexOf(token) + token.length, errors.length).replace(/'(.|\n)*/gmi, '')
        log.error(`Cannot resolve ${chalk.red(pkg)}, try running ${chalk.red(`npm install --save ${pkg}`)}`)
      } else {
        log.error(errors)
      }
    }
  })

  app.use(webpackDevMiddleware(compiler, Object.assign({
    publicPath: webpackConf.output.publicPath
  }, verboseOpts)))

  app.use(webpackHotMiddleware(compiler, Object.assign({
    reload: true,
    path: '/__webpack_hmr',
    heartbeat: 100
  }, verboseOpts)))

  return app.start().then(() => {
    log.info(`Using ${options.fileName}`)
    log.info(`Qubit-CLI listening on port ${config.port}`)
    return { app }
  })
}

function createWebpackConfig (options) {
  return Object.assign({}, webpackConf, {
    entry: [
      path.join(CLIENT_PATH, options.isPreScript ? 'serve-pre' : 'serve-experience')
    ].concat(webpackConf.entry),
    plugins: webpackConf.plugins.concat([
      new webpack.DefinePlugin({
        __VARIATION__: `'${options.fileName}'`,
        __VARIATION_STYLE_EXTENSION__: `'${STYLE_EXTENSION}'`
      })
    ])
  })
}
