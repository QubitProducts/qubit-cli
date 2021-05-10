const _ = require('lodash')

module.exports = function pickVariation (names) {
  return _.last(
    names.filter(f => /\.js$/.test(f) && f.includes('variation')).sort()
  )
}
