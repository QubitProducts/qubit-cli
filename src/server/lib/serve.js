const path = require('path')
const _ = require('lodash')
const fs = require('fs-extra')
const chalk = require('chalk')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const pickVariation = require('../../lib/pick-variation')
const getWebpackConfig = require('../../../webpack')
const config = require('../../../config')
const log = require('../../lib/log')
const createApp = require('../app')
const globalCodeWarning = require('../../lib/global-code-warning')
const commonCodeWarning = require('../../lib/common-code-warning')
const cssCodeWarning = require('../../lib/css-code-warning')
const { installQubitDeps } = require('../../lib/install-qubit-deps')
const getPkg = require('../../lib/get-pkg')
const cors = require('cors')
const { STYLE_EXTENSION, CLIENT_PATH } = require('../../constants')
const CWD = process.cwd()

module.exports = async function serve (options) {
  await installQubitDeps()
  const app = await createApp()
  const pkg = await getPkg()
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Private-Network', 'true')
    next()
  })
  app.use(
    cors({
      origin: true,
      credentials: true
    })
  )
  options.verbose = options.verbose || false

  if (/(triggers|global|\.less|\.css$)/.test(options.fileName)) {
    log.info(
      'Hint: you should be watching the entry point for your experience, i.e. your variation file!'
    )
  }

  options.isPreScript = _.get(pkg, 'meta.isPreScript')
  options.isPlacement = _.get(pkg, 'meta.placementId')

  if (options.isPreScript) {
    options.fileName = 'pre'
  } else if (options.isPlacement) {
    options.fileName = 'placement'
  } else {
    await globalCodeWarning(CWD)
    await commonCodeWarning(CWD)
    await cssCodeWarning(CWD)

    if (!options.fileName) {
      const files = await fs.readdir(CWD)
      options.fileName = await pickVariation(files)

      if (!options.fileName) {
        if (files.includes('placement.js')) {
          options.fileName = 'placement'
          options.isPlacement = true
        } else {
          return log.warn(
            'Please ensure you are within a directory with something to serve and try again!'
          )
        }
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
  const webpackConf = createWebpackConfig(options, pkg)

  const compiler = webpack(webpackConf)

  compiler.plugin('done', stats => {
    if (!options.verbose && stats.hasErrors()) {
      const token = "Can't resolve '"
      const errors = stats.toString('errors-only').trim()
      if (errors && errors.includes(token)) {
        const pkg = errors
          .substring(errors.indexOf(token) + token.length, errors.length)
          .replace(/'(.|\n)*/gim, '')
        log.error(
          `Cannot resolve ${chalk.red(pkg)}, try running ${chalk.red(
            `npm install --save ${pkg}`
          )}`
        )
      } else {
        log.error(errors)
      }
    }
  })

  app.use(
    webpackDevMiddleware(
      compiler,
      Object.assign(
        {
          publicPath: webpackConf.output.publicPath
        },
        verboseOpts
      )
    )
  )

  app.use(
    webpackHotMiddleware(
      compiler,
      Object.assign(
        {
          reload: true,
          path: '/__webpack_hmr',
          heartbeat: 100
        },
        verboseOpts
      )
    )
  )

  return app.start().then(() => {
    log.info(`Using ${options.fileName}`)
    log.info(`Qubit-CLI listening on port ${config.port}`)
    return { app }
  })
}

function createWebpackConfig (options, pkg) {
  const config = getWebpackConfig()
  let entry

  if (options.isPreScript) entry = 'serve-pre'
  if (options.isPlacement) entry = 'serve-placement'
  if (!entry) entry = 'serve-experience'

  config.entry.push(path.join(CLIENT_PATH, entry))
  config.plugins.push(
    new webpack.DefinePlugin({
      __VARIATION__: `'${options.fileName}'`,
      __VARIATION_STYLE_EXTENSION__: `'${STYLE_EXTENSION}'`
    })
  )

  const rule = config.module.loaders
    .find(loader => loader.use.find(rule => rule.loader === 'experience-less'))
    .use.find(rule => rule.loader === 'experience-less')

  const meta = pkg.meta || {}
  if (options.fileName.includes('variation')) {
    const ids = {
      variationMasterId: options.fileName.replace(/[^0-9]/gi, ''),
      experienceId: meta.experienceId
    }
    Object.assign(rule.options, ids)
  }

  if (options.fileName.includes('placement')) {
    const ids = {
      placementId: meta.placementId
    }
    Object.assign(rule.options, ids)
  }

  return config
}
