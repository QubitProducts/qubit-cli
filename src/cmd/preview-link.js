const _ = require('lodash')
let getPkg = require('../lib/get-pkg')
let log = require('../lib/log')

module.exports = async function previewLinks () {
  let pkg = await getPkg()
  pkg.meta = pkg.meta || {}
  const {propertyId, previewUrl} = pkg.meta
  if (!propertyId || !previewUrl) {
    log(`sorry! this feature assumes you have already setup an experience locally`)
    return log(`it uses the package.json metadata to construct the preview link for an existing experience`)
  }
  return _.values(pkg.meta.variations).filter((v) => !v.variationIsControl).map(getLink)
  function getLink (v) {
    return `${previewUrl}#smartserve_p=${propertyId}&smartserve_preview=1&bypass_segments=&etcForceCreative=${v.variationId}`
  }
}
