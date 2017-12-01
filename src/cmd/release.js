const np = require('np/index')
const ui = require('np/lib/ui')
const log = require('../lib/log')
const login = require('../server/lib/login')
const { getRegistryToken } = require('../lib/get-token')

// { anyBranch, cleanup, yolo, publish, tag, yarn }
module.exports = async function release (version, flags) {
  try {
    // Login authenticates against our private registry and configures all the associated private scopes
    await getRegistryToken(() => login(), true)
    const options = await getOptions()
    const pkg = await runRelease(options)
    log.info(`${pkg.name} ${pkg.version} published 🎉`)
  } catch (err) {
    log.error(err)
  }

  function getOptions () {
    if (version) {
      return Object.assign({}, flags, {
        confirm: true,
        version
      })
    }
    return ui(flags)
  }

  async function runRelease (options) {
    if (!options.confirm) process.exit()
    let result
    // np should not be run in production-mode, because it will not install dev-dependencies.
    // So if necessary, we're temporarily switching to development-mode.
    if (process.env.NODE_ENV === 'production') {
      process.env.NODE_ENV = 'development'
      result = await np(options.version, options)
      process.env.NODE_ENV = 'production'
    } else {
      result = await np(options.version, options)
    }
    return result
  }
}
