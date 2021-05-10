const _ = require('slapdash')
const microAmd = require('micro-amd')

module.exports = function createAMD () {
  const amd = microAmd({ base: '//d22rutvoghj3db.cloudfront.net/' })
  _.set(window, '__qubit.cli.amd', amd)
  Object.defineProperty(window.__qubit, 'amd', { get: () => amd })
  return amd
}
