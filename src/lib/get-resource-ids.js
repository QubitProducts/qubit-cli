const _ = require('lodash')
const suggest = require('./suggest')
const parseUrl = require('./parse-url')
const { isUrl, isId } = require('./is-type')

async function getPropertyAndExperienceIds (
  propertyIdOrUrl,
  experienceId,
  pkg
) {
  // Try to parse command line arguments first
  if (isUrl(propertyIdOrUrl)) return parseUrl(propertyIdOrUrl)

  let propertyId

  if (isId(propertyIdOrUrl)) {
    propertyId = Number(propertyIdOrUrl)
    if (isId(experienceId)) {
      experienceId = Number(experienceId)
    } else {
      experienceId = await suggest.experience(propertyId)
    }
    return { propertyId, experienceId }
  }

  // Fall back on package.json
  if (!propertyId || !experienceId) {
    const pkgMeta = _.get(pkg, 'meta')
    if (pkgMeta) return _.pick(pkgMeta, ['propertyId', 'experienceId'])
  }

  // Prompt user
  if (!propertyId || !experienceId) {
    ;({ propertyId, experienceId } = (await suggest.both()) || {})
  }

  if (!propertyId || !experienceId) {
    throw new Error('This command requires a property and an experience')
  }

  return { propertyId, experienceId }
}

async function getPropertyId (propertyIdOrUrl, pkg) {
  let propertyId = _.get(pkg, 'meta.propertyId')

  if (isId(propertyIdOrUrl)) {
    propertyId = Number(propertyIdOrUrl)
  } else if (!propertyId) {
    propertyId = await suggest.property()
  }

  if (!propertyId) throw new Error('This command requires a property')

  return propertyId
}

async function getIterationId (experienceId) {
  const iterationId = await suggest.iteration(experienceId)
  if (!iterationId) throw new Error('This command requires an iteration')
  return iterationId
}

async function getPlacementId (propertyId, placementId, pkg) {
  if (placementId) return placementId
  placementId = _.get(pkg, 'meta.placementId')
  if (!placementId) {
    placementId = await suggest.placement(propertyId)
  }
  if (!placementId) throw new Error('This command requires a placement')
  return placementId
}

async function getTagId (propertyId, tagId, pkg) {
  if (tagId) return tagId
  tagId = _.get(pkg, 'meta.tagId')
  if (!tagId) {
    tagId = await suggest.tags(propertyId)
  }
  if (!tagId) throw new Error('This command requires a tag')
  return tagId
}

async function getPersonalisationType (personalisationType, pkg) {
  if (personalisationType) return personalisationType
  personalisationType = _.get(pkg, 'meta.personalisationType')
  if (!personalisationType) {
    personalisationType = await suggest.personalisationType()
  }
  if (!personalisationType) {
    throw new Error('This command requires a personalisation type')
  }
  return personalisationType
}

module.exports = {
  getPropertyAndExperienceIds,
  getPropertyId,
  getIterationId,
  getPlacementId,
  getTagId,
  getPersonalisationType
}
