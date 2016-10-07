const _ = require('lodash')

module.exports = function parsePackage () {
  return transform(require('package.json'))
}

function transform (pkg) {
  return _.each(pkg.meta.variations, function (meta, variationName) {
    return { meta: meta }
  })
}
