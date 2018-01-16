const _ = require('lodash')
const url = require('urlite')
let propertyService = require('../services/property')

module.exports = async function getPreviewLinks ({ propertyId, variations, previewUrl }) {
  const propertyMeta = await propertyService.get(propertyId)
  return _.values(variations)
    .filter((v) => !v.variationIsControl)
    .map(getLink)

  function getLink ({ variationMasterId }) {
    let withParams
    const previewParams = `qb_opts=preview,bypass_segments&qb_experiences=${variationMasterId}`
    if (propertyMeta.use_fragment) {
      withParams = previewUrl.includes('#')
        ? `${previewUrl}&${previewParams}`
        : `${previewUrl}#${previewParams}`
    } else {
      let parsed = url.parse(previewUrl)
      parsed.search = parsed.search
        ? `${parsed.search}&${previewParams}`
        : `?${previewParams}`
      withParams = url.format(parsed)
    }
    return withParams
  }
}
