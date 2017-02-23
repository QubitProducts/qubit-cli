const _ = require('lodash')

module.exports = async function getPreviewLinks ({ variations, previewUrl, propertyId }) {
  return _.values(variations)
    .filter((v) => !v.variationIsControl)
    .map(getLink)

  function getLink (v) {
    return `${previewUrl}#smartserve_p=${propertyId}&smartserve_preview=1&bypass_segments=&etcForceCreative=${v.variationId}`
  }
}
