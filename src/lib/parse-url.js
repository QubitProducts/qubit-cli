module.exports = function parseUrl (uri) {
  const ids = uri.match(/\/\d+/g).map(s => s.substr(1)).map(Number)
  if (ids.length < 2) throw new Error('expected url to have propertyId and experienceId')
  let [propertyId, experienceId] = ids
  return {
    propertyId: propertyId,
    experienceId: experienceId
  }
}
