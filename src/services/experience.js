const _ = require('lodash')
const fetch = require('../lib/fetch')
const withMetrics = require('../lib/with-metrics')
const GLOBAL = ''
const EXPERIENCE = require('./experience.json')
const TRIGGERS = 'function triggers (options, cb) {\n  cb()\n}'
const DEFAULTS = { GLOBAL, TRIGGERS, EXPERIENCE }

function get (propertyId, experienceId) {
  return fetch.get(getPath(propertyId, experienceId))
}

function set (propertyId, experienceId, val) {
  return fetch.put(getPath(propertyId, experienceId), { experiment: withMetrics(val) })
}

function create (propertyId) {
  return fetch.post(getPath(propertyId), { experiment: Object.assign({}, withMetrics(EXPERIENCE, {created: true}), { propertyId }) })
}

function getCode (experience) {
  const rules = _.get(experience, 'recent_iterations.draft.activation_rules')
  const rule = rules && rules.find(rule => rule.key === 'custom_javascript')
  return {
    'global.js': _.get(experience, 'recent_iterations.draft.global_code') || GLOBAL,
    'triggers.js': (rule && rule.value) || TRIGGERS
  }
}

function setCode (experience, files) {
  experience = _.cloneDeep(experience)
  const draft = experience.recent_iterations.draft
  const rules = draft.activation_rules || []
  const customJs = rules.find(rule => rule.key === 'custom_javascript')
  if (customJs) {
    customJs.value = files['triggers.js']
  } else {
    rules.push({
      key: 'custom_javascript',
      type: 'code',
      value: files['triggers.js'] || TRIGGERS
    })
  }
  Object.assign(draft, {
    global_code: files['global.js'] || GLOBAL,
    activation_rules: rules
  })
  return experience
}

function getPath (propertyId, experienceId) {
  let url = `/p/${propertyId}/smart_serve/experiments`
  if (experienceId) url += `/${experienceId}?embed=recent_iterations`
  return url
}

module.exports = { get, set, create, getCode, setCode, DEFAULTS }
