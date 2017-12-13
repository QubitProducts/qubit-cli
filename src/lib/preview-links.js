const _ = require('lodash')

module.exports = async function getPreviewLinks ({ variations, previewUrl }) {
  return _.values(variations)
    .filter((v) => !v.variationIsControl)
    .map(getLink)

  function getLink ({ variationMasterId }) {
    const separator = previewUrl.match(/#/) ? '&' : '#'
    return `${previewUrl}${separator}qb_opts=preview,bypass_segments&qb_experiences=${variationMasterId}`
  }
}
