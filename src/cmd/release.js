const ui = require('np/lib/ui')
const log = require('../lib/log')
const np = require('../lib/release')
const { getRegistryToken } = require('../lib/get-delegate-token')

// { anyBranch, cleanup, yolo, publish, tag, yarn }
module.exports = async function release (version, flags) {
  // Authenticate against our registry and configure scopes:
  await getRegistryToken(true)
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
