var fetch = require('./utils/fetch')
module.exports = { get: getVariation, set: setVariation }

function getVariation (data) {
  var url = `${data.domain}/p/${data.propertyId}/` +
    `smart_serve/experiments/${data.experimentId}/` +
    `recent_iterations/draft/variations`
  return fetch.get(url, data.auth).then(function (resp) {
    return resp.data.find((v) => v.master_id === Number(data.masterId))
  })
}

function setVariation (data, codes) {
  return getVariation(data).then(function (variation) {
    variation.execution_code = codes.execution
    variation.custom_styles = codes.variation
    var url = `${data.domain}/p/${data.propertyId}/` +
      `smart_serve/experiments/${data.experimentId}/` +
      `recent_iterations/draft/variations/${variation.id}`
    return fetch.put(url, data.auth, { variation: variation })
  })
}
