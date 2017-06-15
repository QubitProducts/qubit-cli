const _ = require('lodash')

module.exports = async function getPreviewLinks ({ variations, previewUrl, propertyId }) {
  return _.values(variations)
    .filter((v) => !v.variationIsControl)
    .map(getLink)

  function getLink (v) {
    return `${previewUrl}#smartserve_p=${propertyId}&qb_experiences=${v.variationId}&qb_opts=preview,bypass_segments`
  }
}
