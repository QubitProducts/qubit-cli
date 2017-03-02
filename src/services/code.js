const _ = require('lodash')
const experienceService = require('./experience')
const variationService = require('./variation')
const pkgService = require('./pkg')

async function get (propertyId, experienceId) {
  const [experience, variations] = [
    await experienceService.get(propertyId, experienceId),
    await variationService.getAll(propertyId, experienceId)
  ]
  return getCode(experience, variations)
}

async function set (propertyId, experienceId, files) {
  const oldExperience = await experienceService.get(propertyId, experienceId)
  let newExperience = experienceService.setCode(oldExperience, files)
  newExperience = pkgService.setCode(newExperience, files)
  return {
    experience: _.isEqual(oldExperience, newExperience)
      ? oldExperience
      : await experienceService.set(propertyId, experienceId, newExperience),
    variations: await Promise.all(variationService.getAll(propertyId, experienceId).map(async oldVariation => {
      if (oldVariation.is_control) return oldVariation
      const newVariation = variationService.setCode(oldVariation, files)
      return _.isEqual(oldVariation, newVariation)
        ? oldVariation
        : await variationService.set(propertyId, experienceId, oldVariation.id, newVariation)
    }))
  }
}

function getCode (experience, variations) {
  const files = {}
  Object.assign(files, experienceService.getCode(experience), pkgService.getCode(experience, variations))
  variations.filter((v) => !v.is_control).map(variationService.getCode).forEach((v) => Object.assign(files, v))
  return files
}

module.exports = { get, set, getCode }
