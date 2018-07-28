const { getAll } = require('../services/templates')

module.exports = {
  getTemplates: async function getTemplates (propertyId) {
    const templates = await getAll(propertyId)
    return templates || []
  }
}
