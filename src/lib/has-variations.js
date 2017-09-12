const _ = require('lodash')

module.exports = function hasVariations (pkg) {
  if (!_.get(pkg, 'meta.variations')) return false
  return Object.keys(_.get(pkg, 'meta.variations')).length > 0
}
