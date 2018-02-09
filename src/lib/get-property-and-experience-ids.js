const suggest = require('./suggest')
const parseUrl = require('./parse-url')
const { isUrl, isId } = require('./is-type')

/**
 * Get the property-id and experience-id from the user.
 * @param {[*, *]} args - possible existing inputs for the two ids
 * @returns {Promise.<?{propertyId: Number, experienceId: Number}>}
 */
async function getPropertyAndExperienceIds (...args) {
  if (isUrl(args[0])) { return parseUrl(args[0]) }

  let propertyId, experienceId

  if (isId(args[0])) {
    propertyId = Number(args[0])
    if (isId(args[1])) {
      experienceId = Number(args[1])
    } else {
      experienceId = await suggest.experience(propertyId)
    }
  } else {
    ;({propertyId, experienceId} = await suggest.both() || {})
  }

  if (!propertyId || !experienceId) return null

  return {propertyId, experienceId}
}

/**
 * Get a property-id from the user.
 * @param {[*]} args - possible existing input for the id
 * @returns {number}
 */
async function getPropertyId (...args) {
  let propertyId

  if (isId(args[0])) {
    propertyId = Number(args[0])
  } else {
    propertyId = await suggest.property()
  }

  if (!propertyId) return null

  return propertyId
}

module.exports = {
  getPropertyAndExperienceIds,
  getPropertyId
}
