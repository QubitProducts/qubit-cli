let fetch = require('../lib/fetch')

function get (domain, propertyId, experienceId) {
  return fetch.get(domain, getPath(propertyId, experienceId))
}

function update (domain, propertyId, experienceId, globalCode, triggers) {
  return get(domain, propertyId, experienceId).then(merge).then(put)

  function put (experiment) {
    return fetch.put(domain, getPath(propertyId, experienceId), { experiment })
  }

  function merge (experience) {
    let draft = experience.recent_iterations.draft
    let rules = draft.activation_rules || []
    let customJs = rules.find(rule => rule.key === 'custom_javascript')
    if (customJs) {
      customJs.value = triggers
    } else {
      rules.push({
        key: 'custom_javascript',
        type: 'code',
        value: triggers
      })
    }
    Object.assign(draft, {
      global_code: globalCode,
      activation_rules: rules
    })
    return experience
  }
}

function extract (experience) {
  let iteration = experience.recent_iterations.draft
  let rule = iteration.activation_rules.find(rule => rule.key === 'custom_javascript')
  return {
    'global.js': iteration.global_code || '',
    'triggers.js': (rule && rule.value) || 'function triggers (options, cb) {\n  cb()\n}'
  }
}

function getPath (propertyId, experienceId) {
  return `/p/${propertyId}/smart_serve/experiments/${experienceId}?embed=recent_iterations,schedule,goals`
}

module.exports = { get, update, extract }
