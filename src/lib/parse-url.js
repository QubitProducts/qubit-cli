module.exports = { parseExperienceUrl, parsePlacementUrl }

function parseExperienceUrl (url) {
  const match = url.match(/\/p\/([^/]+)\/experiences\/([^/]+)/i)
  if (!match) return null
  const [, propertyId, experienceId] = match

  return {
    propertyId: Number(propertyId),
    experienceId: Number(experienceId)
  }
}

function parsePlacementUrl (url) {
  const match = url.match(/\/p\/([^/]+)\/atom\/placements\/([^/]+)/i)
  if (!match) return null
  const [, propertyId, placementId] = match
  return {
    propertyId: Number(propertyId),
    placementId
  }
}
