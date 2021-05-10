module.exports = function parseUrl (uri) {
  const ids = uri
    .replace(/.*?\//, '')
    .match(/\/\d+/g)
    .map(s => s.substr(1))
    .map(Number)
  if (ids.length < 2) { throw new Error('expected url to have propertyId and experienceId') }
  const [propertyId, experienceId] = ids
  return {
    propertyId: Number(propertyId),
    experienceId: Number(experienceId)
  }
}
