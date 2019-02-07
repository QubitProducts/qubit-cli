var microAmd = require('micro-amd')

module.exports = function createAMD () {
  const amd = microAmd({ base: '//d22rutvoghj3db.cloudfront.net/' })
  window.__qubit = window.__qubit || {}
  window.__qubit.cli = window.__qubit.cli || {}
  window.__qubit.cli.amd = amd
  Object.defineProperty(window.__qubit, 'amd', { get: () => amd })
  return amd
}
