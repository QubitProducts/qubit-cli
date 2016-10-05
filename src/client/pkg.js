let _ = require('./lodash')

module.exports = function parsePackage () {
  return transform(require('package.json'))
}

function transform (pkg) {
  return _.each(pkg.variations, function (meta, variationNAme) {
    return { meta: meta }
  })
}
