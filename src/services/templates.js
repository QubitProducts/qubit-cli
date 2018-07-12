const fetch = require('../lib/fetch')

function getAll (propertyId) {
  console.log(`/api/p/${propertyId}/templates`)
  return fetch.get(`/api/p/${propertyId}/templates`)
}

function createTemaple (propertyId, template) {
  return fetch.post(`/api/p/${propertyId}/templates`, template)
}

function get (templateId) {
  return fetch.get(`/api/templates/${templateId}`)
}

function update (templateId) {
  return fetch.put(`/api/templates/${templateId}`)
}

async function createExperienceFromTemplate (templateId, experience) {
  return fetch.post(`/api/templates/${templateId}/create-experience`, { experiment: experience })
}

module.exports = { get, getAll, createTemaple, update, createExperienceFromTemplate }
