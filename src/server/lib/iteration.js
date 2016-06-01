var fetch = require('./utils/fetch')
module.exports = { get: getIteration, set: setIteration }

function getIteration (data) {
  var url = `${data.domain}/p/${data.propertyId}/` +
    `smart_serve/experiments/${data.experimentId}` +
    '?embed=recent_iterations,schedule,goals'
  return fetch.get(url, data.auth).then(function (resp) {
    return resp.data.recent_iterations.draft
  })
}

function setIteration (data, codes) {
  var url = `${data.domain}/p/${data.propertyId}/` +
    `smart_serve/experiments/${data.experimentId}` +
    '?embed=recent_iterations,schedule,goals'
  return fetch.get(url, data.auth).then(function (resp) {
    var experiment = resp.data
    experiment.recent_iterations.draft.global_code = codes.global
    var rules = experiment.recent_iterations.draft.activation_rules || []
    var customJs = rules.find(rule => rule.key === 'custom_javascript')
    if (customJs) {
      customJs.value = codes.activation
    } else {
      rules.push({
        key: 'custom_javascript',
        type: 'code',
        value: codes.activation
      })
    }
    experiment.recent_iterations.draft.activation_rules = rules
    return { experiment: experiment }
  }).then(function (experiment) {
    return fetch.put(url, data.auth, experiment)
  })
}
