const _ = require('lodash')
const getPkg = require('../lib/get-pkg')

module.exports = async function previewLinks () {
  let pkg = await getPkg()
  const {propertyId, previewUrl} = pkg.meta
  return _.values(pkg.meta.variations).filter((v) => !v.variationIsControl).map(getLink)

  function getLink (v) {
    return `${previewUrl}#smartserve_p=${propertyId}&smartserve_preview=1&bypass_segments=&etcForceCreative=${v.variationId}`
  }
}
