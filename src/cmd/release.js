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
    log.info(`\n ${pkg.name} ${pkg.version} published 🎉`)
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

  function runRelease (options) {
    if (!options.confirm) process.exit()
    return np(options.version, options)
  }
}
