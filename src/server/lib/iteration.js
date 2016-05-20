var fetch = require('./utils/fetch')
module.exports = { get: getIteration, set: setIteration }

function getIteration (data) {
  var url = `${data.domain}/p/${data.propertyId}/` +
    `smart_serve/experiments/${data.experimentId}` +
    `?embed=recent_iterations,schedule,goals`
  return fetch.get(url, data.auth).then(function (resp) {
    return resp.data.recent_iterations.draft
  })
}

function setIteration (data, codes) {
  var url = `${data.domain}/p/${data.propertyId}/` +
    `smart_serve/experiments/${data.experimentId}` +
    `?embed=recent_iterations,schedule,goals`
  return fetch.get(url, data.auth)
    .then(function (resp) {
      var experiment = resp.data
      experiment.recent_iterations.draft.global_code = codes.global
      experiment.recent_iterations.draft.custom_segment = codes.activation
      return { experiment: experiment }
    })
    .then(function (experiment) {
      return fetch.put(url, data.auth, experiment)
    })
}
