let variationService = require('./variation')
let fetch = require('../lib/fetch')

function get (domain, propertyId, experienceId) {
  return fetch.get(domain, getPath(propertyId, experienceId))
}

function code (domain, propertyId, experienceId) {
  return Promise.all([
    get(domain, propertyId, experienceId),
    variationService.get(domain, propertyId, experienceId)
  ])
  .then(([experience, variations]) => {
    return Object.assign(experience, extract(experience), {
      domain: domain,
      variations: variations.map((variation) => Object.assign(variation, variationService.extract(variation)))
    })
  })
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
    globalCode: iteration.global_code,
    triggers: rule && rule.value
  }
}

function getPath (propertyId, experienceId) {
  return `/p/${propertyId}/smart_serve/experiments/${experienceId}?embed=recent_iterations,schedule,goals`
}

module.exports = { get, code, update, extract }
