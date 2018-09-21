const { getAll } = require('../services/templates')

module.exports = {
  getTemplates,
  getPublishedTemplates
}

async function getTemplates (propertyId) {
  const templates = await getAll(propertyId)
  return templates || []
}

async function getPublishedTemplates (propertyId) {
  const templates = await getTemplates(propertyId)
  return templates.filter(t => t.penultimate_iteration_id)
}
