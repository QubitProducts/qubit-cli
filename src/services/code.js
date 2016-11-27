const _ = require('lodash')
const experienceService = require('./experience')
const variationService = require('./variation')
const pkgService = require('./pkg')

async function get (propertyId, experienceId) {
  const [experience, variations] = await Promise.all([
    experienceService.get(propertyId, experienceId),
    variationService.getAll(propertyId, experienceId)
  ])
  return getCode(experience, variations)
}

async function set (propertyId, experienceId, files) {
  const oldExperience = await experienceService.get(propertyId, experienceId)
  let newExperience = experienceService.setCode(oldExperience, files)
  newExperience = pkgService.setCode(newExperience, files)
  if (!_.isEqual(oldExperience, newExperience)) await experienceService.set(propertyId, experienceId, newExperience)
  const variations = await variationService.getAll(propertyId, experienceId)
  _.each(variations, async(oldVariation) => {
    if (oldVariation.is_control) return
    const newVariation = variationService.setCode(oldVariation, files)
    if (!_.isEqual(oldVariation, newVariation)) await variationService.set(propertyId, experienceId, oldVariation.id, newVariation)
  })
}

function getCode (experience, variations) {
  const files = {}
  Object.assign(files, experienceService.getCode(experience), pkgService.getCode(experience, variations))
  variations.filter((v) => !v.is_control).map(variationService.getCode).forEach((v) => Object.assign(files, v))
  return files
}

module.exports = { get, set, getCode }
