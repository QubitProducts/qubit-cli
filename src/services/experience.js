const _ = require('lodash')
const fetch = require('../lib/fetch')
const withMetrics = require('../lib/with-metrics')
const getUser = require('../lib/get-user')
const { execution_code: EXECUTION_CODE } = require('@qubit/experience-defaults').custom
const DEFAULT_EXPERIENCE = {
  name: 'Created by Qubit-CLI',
  propertyId: null,
  editor_version: 3,
  recent_iterations: {
    draft: {
      variations: [{
        advanced_mode: 1,
        execution_code: EXECUTION_CODE
      }]
    }
  },
  solution_id: 6
}

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

async function create (experience) {
  const user = await getUser()
  const experiment = _.merge({}, withMetrics(DEFAULT_EXPERIENCE, { ...user, created: true }), experience)
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
  return fetch.delete(`/api/experiences/${experienceId}`)
}

module.exports = { get, getAll, set, create, publish, pause, resume, duplicate, status, remove }
