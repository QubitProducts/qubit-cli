const url = require('url')

module.exports = function parseUrl (uri) {
  let ids = uri.match(/\/\d+/g).map(s => s.substr(1)).map(Number)
  if (ids.length < 2) throw new Error('expected url to have propertyId and experienceId')
  let [propertyId, experienceId] = ids
  return {
    domain: getDomain(uri),
    propertyId: propertyId,
    experienceId: experienceId
  }
}

function getDomain (uri) {
  uri = url.parse(uri)
  return uri.protocol + '//' + uri.host
}
