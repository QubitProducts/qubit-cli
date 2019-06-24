const _ = require('lodash')
const suggest = require('./suggest')
const parseUrl = require('./parse-url')
const { isUrl, isId } = require('./is-type')

async function getPropertyAndExperienceIds (propertyIdOrUrl, experienceId, pkg) {
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
    ;({ propertyId, experienceId } = (await suggest.both() || {}))
  }

  if (!propertyId || !experienceId) throw new Error('This command requires a property and an experience')

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
  let iterationId = await suggest.iteration(experienceId)
  if (!iterationId) throw new Error('This command requires an iteration')
  return iterationId
}

module.exports = {
  getPropertyAndExperienceIds,
  getPropertyId,
  getIterationId
}
