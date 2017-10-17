const np = require('np/index')
const ui = require('np/lib/ui')
const log = require('../lib/log')
const login = require('../server/lib/login')
const { getRegistryToken } = require('../lib/get-token')

// { anyBranch, cleanup, yolo, publish, tag, yarn }
module.exports = async function release (version, options) {
  let flags = options

  // Login authenticates against our private registry and configures all the associated private scopes
  await getRegistryToken(() => login(), true)

  return Promise.resolve()
    .then(getOptions)
    .then(runRelease)
    .then(logResult)
    .catch(logError)

  function getOptions () {
    if (version) {
      return Object.assign({}, flags, {
        confirm: true,
        version
      })
    }
    return ui(flags)
  }

  function logError (err) {
    log.error(err)
  }

  function runRelease (options) {
    if (!options.confirm) process.exit()
    return np(options.version, options)
  }

  function logResult (pkg) {
    log.info(`\n ${pkg.name} ${pkg.version} published 🎉`)
  }
}
