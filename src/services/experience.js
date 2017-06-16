const _ = require('lodash')
const fetch = require('../lib/fetch')
const withMetrics = require('../lib/with-metrics')
const EXPERIENCE = require('./experience.json')

function get (experienceId) {
  return fetch.get(`/api/experiences/${experienceId}`)
}

function getAll (propertyId) {
  return fetch.get(`/api/p/${propertyId}/experiments/summary`)
}

function set (experienceId, experience) {
  delete experience.update_sequence_id
  return fetch.put(`/api/experiences/${experienceId}`, { experiment: experience })
}

function create (experience) {
  const experiment = _.merge({}, withMetrics(EXPERIENCE, { created: true }), experience)
  return fetch.post(`/api/p/${experience.propertyId}/experiences`, { experiment })
}

function publish (propertyId, experienceId) {
  return fetch.post(`/api/p/${propertyId}/experiments/${experienceId}/publish`)
}

function pause (propertyId, experienceId) {
  return fetch.post(`/api/p/${propertyId}/experiments/${experienceId}/pause`)
}

function resume (propertyId, experienceId) {
  return fetch.post(`/api/p/${propertyId}/experiments/${experienceId}/resume`)
}

function status (propertyId, experienceId) {
  return fetch.get(`/api/p/${propertyId}/experiments/${experienceId}/status`)
}

function duplicate (experienceId, options) {
  return fetch.post(`/api/experiences/${experienceId}/duplicate`, options)
}

function remove (propertyId, experienceId) {
  return fetch.post(`/api/p/${propertyId}/experiments/${experienceId}/delete`)
}

module.exports = { get, getAll, set, create, publish, pause, resume, duplicate, status, remove }
