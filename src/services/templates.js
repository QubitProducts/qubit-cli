const fetch = require('../lib/fetch')

function getAll (propertyId) {
  return fetch.get(`/api/p/${propertyId}/templates`)
}

function createTemplate (propertyId, template) {
  return fetch.post(`/api/p/${propertyId}/templates`, template)
}

function get (templateId) {
  return fetch.get(`/api/templates/${templateId}`)
}

function update (templateId, template) {
  return fetch.put(`/api/templates/${templateId}`, template)
}

async function createExperienceFromTemplate (templateId, experiment) {
  return fetch.post(`/api/templates/${templateId}/create-experience`, { experiment })
}

module.exports = { get, getAll, createTemplate, update, createExperienceFromTemplate }
