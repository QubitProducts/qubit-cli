const np = require('np/index')
const ui = require('np/lib/ui')
const log = require('../lib/log')
const login = require('../server/lib/login')

module.exports = async function release (version, { anyBranch, cleanup, yolo, publish, tag, yarn }) {
  let flags = { anyBranch, cleanup, yolo, publish, tag, yarn }

  // Login authenticates against our private registry and configures all the associated private scopes
  await login()

  return Promise.resolve()
    .then(getOptions)
    .then(runRelease)
    .then(logResult)

  function getOptions () {
    if (version) {
      return Object.assign({}, flags, {
        confirm: true,
        version
      })
    }
    return ui(flags)
  }

  function runRelease (options) {
    if (!options.confirm) process.exit()
    return np(options.version, options)
  }

  function logResult (pkg) {
    log.info(`\n ${pkg.name} ${pkg.version} published 🎉`)
  }
}
