const config = require('config')
const start = require('../server')
const getCerts = require('../lib/get-certs')
const log = require('../lib/log')

module.exports = async function serve (variation, opts) {
  try {
    const certs = await getCerts()
    const xp = start(Object.assign(opts, {
      certs: certs,
      variation: variation
    }))
    xp.server.listen(config.port, () => log(`xp listening on port ${config.port}`))
    return xp
  } catch (err) {
    log.error(err)
  }
}
