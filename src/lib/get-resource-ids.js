const _ = require('lodash')
const suggest = require('./suggest')
const { parseExperienceUrl, parsePlacementUrl } = require('./parse-url')
const { isId } = require('./is-type')

async function getPropertyAndExperienceIds (
  propertyIdOrUrl,
  experienceId,
  pkg
) {
  // Try to parse command line arguments first
  const fromUrl = parseExperienceUrl(propertyIdOrUrl)
  if (fromUrl) return fromUrl

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
    return Number(propertyIdOrUrl)
  }

  const fromUrl =
    parsePlacementUrl(propertyIdOrUrl) || parseExperienceUrl(propertyIdOrUrl)
  if (fromUrl) return fromUrl.propertyId

  if (!propertyId) {
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

async function getPlacementId (propertyIdOrUrl, placementId, pkg) {
  if (placementId) return placementId

  const fromUrl = parsePlacementUrl(propertyIdOrUrl)
  if (fromUrl) return fromUrl.placementId

  placementId = _.get(pkg, 'meta.placementId')
  if (!placementId) {
    placementId = await suggest.placement(propertyIdOrUrl)
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
    throw new Error('This command requires a campaign type')
  }
  return personalisationType
}

async function getProductSource (productSource, pkg) {
  if (productSource) {
    return productSource
  }
  productSource = _.get(pkg, 'meta.productSource')
  if (!productSource) {
    productSource = await suggest.productSource()
  }
  if (!productSource) {
    throw new Error('This command requires a product source')
  }
  return productSource
}

module.exports = {
  getPropertyAndExperienceIds,
  getPropertyId,
  getIterationId,
  getPlacementId,
  getTagId,
  getPersonalisationType,
  getProductSource
}
