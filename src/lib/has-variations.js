const _ = require('lodash')

module.exports = function hasVariations (pkg) {
  return _.get(pkg, 'meta.variations') && Object.keys(_.get(pkg, 'meta.variations')).length
}
