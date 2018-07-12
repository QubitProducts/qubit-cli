const { getAll } = require('../services/templates')
const { getPropertyFeatures } = require('../services/features')
module.exports = {
  getTemplates: async function getTemplates (propertyId) {
    const features = await getPropertyFeatures(propertyId)
    const hasTemplatesFeatureFlag = features.some(feature => feature.codename === 'EXPERIENCE_TEMPLATES')

    if (hasTemplatesFeatureFlag) {
      const templates = await getAll(propertyId)
      return templates
    }

    return []
  }
}
