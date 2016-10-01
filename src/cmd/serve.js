const config = require('config')
const start = require('../server')
const getCerts = require('../lib/https')
const log = require('../lib/log')

module.exports = function serve (variation, opts) {
  return getCerts()
    .then((certs) => {
      let xp = start(Object.assign(opts, {
        certs: certs,
        variation: variation
      }))
      xp.server.listen(config.port, () => log(`xp listening on port ${config.port}`))
      return xp
    })
    .catch(console.error)
}
