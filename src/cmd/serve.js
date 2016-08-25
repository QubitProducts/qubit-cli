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
      xp.server.listen(opts.port, () => log(`xp listening on port ${opts.port}`))
      return xp
    })
    .catch(console.error)
}
