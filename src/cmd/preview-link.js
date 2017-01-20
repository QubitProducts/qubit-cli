const _ = require('lodash')
let getPkg = require('../lib/get-pkg')
let log = require('../lib/log')

async function getPreviewLinks () {
  let pkg = await getPkg()
  const {propertyId, previewUrl} = pkg.meta
  return _.values(pkg.meta.variations).filter((v) => !v.variationIsControl).map(getLink)

  function getLink (v) {
    return `${previewUrl}#smartserve_p=${propertyId}&smartserve_preview=1&bypass_segments=&etcForceCreative=${v.variationId}`
  }
}

module.exports = function logPreviewLinks () {
  return getPreviewLinks().then(links => links.map(link => log(link)), log.error)
}
