const _ = require('lodash')
const defaultMeta = {
  name: 'Qubit experience',
  propertyId: null,
  experienceId: null,
  iterationId: null,
  previewUrl: null,
  variations: {
    variation: {
      variationIsControl: false,
      variationMasterId: null,
      variationId: null
    }
  }
}

module.exports = function resolveTemplateVariables (files, meta) {
  _.templateSettings.interpolate = /<%=([\s\S]+?)%>/g
  meta = meta || defaultMeta
  return Object.keys(files).reduce((memo, filename) => {
    const localMeta = Object.assign(
      {},
      meta,
      _.get(meta, `variations.${filename.replace(/\.\w+$/, '')}`)
    )
    const value =
      typeof files[filename] === 'string'
        ? _.template(files[filename])(localMeta)
        : resolveTemplateVariables(files[filename], localMeta)
    memo[filename] = value
    return memo
  }, {})
}
