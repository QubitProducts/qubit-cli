const ui = require('np/lib/ui')
const log = require('../lib/log')
const np = require('../lib/release')
const login = require('../server/lib/login')

// { anyBranch, cleanup, yolo, publish, tag, yarn }
module.exports = async function release (version, flags) {
  // Login authenticates against our private registry and configures all the associated private scopes
  await login()
  const options = await getOptions()
  const pkg = await runRelease(options)
  log.info(`${pkg.name} ${pkg.version} published 🎉`)

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
    return np(options.version, options)
  }
}
