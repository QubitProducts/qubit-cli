const _ = require('lodash')
const fetch = require('../lib/fetch')
const withMetrics = require('../lib/with-metrics')
const hasNoCode = require('../lib/hasNoCode')
const EXPERIENCE = require('./experience.json')
const { GLOBAL, TRIGGERS } = require('../lib/constants')

function get (propertyId, experienceId) {
  return fetch.get(getPath(propertyId, experienceId))
}

function getAll (propertyId) {
  return fetch.get(`/api/p/${propertyId}/experiments/summary`)
}

function set (propertyId, experienceId, experience) {
  delete experience.update_sequence_id
  return fetch.put(getPath(propertyId, experienceId), { experiment: experience })
}

function create (experience) {
  const experiment = _.merge({}, withMetrics(EXPERIENCE, { created: true }), experience)
  return fetch.post(getPath(experience.propertyId), { experiment })
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

function duplicate (propertyId, options) {
  return fetch.post(`/api/p/${propertyId}/experiments/duplicate`, options)
}

function getCode (experience) {
  const rules = _.get(experience, 'recent_iterations.draft.activation_rules')
  const rule = rules && rules.find(rule => rule.key === 'custom_javascript')
  const triggers = rule && rule.value
  const globalCode = _.get(experience, 'recent_iterations.draft.global_code')
  return {
    'global.js': hasNoCode(globalCode) ? GLOBAL : globalCode,
    'triggers.js': hasNoCode(triggers) ? TRIGGERS : triggers
  }
}

function setCode (experience, files) {
  experience = _.cloneDeep(experience)
  const pkg = (files['package.json'] && JSON.parse(files['package.json'])) || {}
  const draft = experience.recent_iterations.draft
  const rules = draft.activation_rules || []
  const customJs = rules.find(rule => rule.key === 'custom_javascript')
  if (customJs) {
    customJs.value = hasNoCode(files['triggers.js']) ? TRIGGERS : files['triggers.js']
  } else {
    rules.push({
      key: 'custom_javascript',
      type: 'code',
      value: hasNoCode(files['triggers.js']) ? TRIGGERS : files['triggers.js']
    })
  }
  Object.assign(draft, {
    global_code: files['global.js'] || GLOBAL,
    activation_rules: rules
  })
  return withMetrics(experience, { templates: _.get(pkg, 'meta.templates') || [] })
}

function getPath (propertyId, experienceId) {
  let url = `/p/${propertyId}/smart_serve/experiments`
  if (experienceId) url += `/${experienceId}?embed=recent_iterations`
  return url
}

module.exports = { get, getAll, set, create, publish, pause, resume, duplicate, status, getCode, setCode }
