const _ = require('lodash')
const experienceService = require('./experience')
const variationService = require('./variation')
const pkgService = require('./pkg')

async function get (propertyId, experienceId) {
  const [experience, variations] = [
    await experienceService.get(propertyId, experienceId),
    await variationService.getAll(experienceId)
  ]
  return getCode(experience, variations)
}

async function set (propertyId, experienceId, files) {
  const oldVariations = await variationService.getAll(experienceId)
  const variations = await Promise.all(oldVariations.map(async oldVariation => {
    if (oldVariation.is_control) return oldVariation
    const newVariation = variationService.setCode(oldVariation, files)
    return eql(oldVariation, newVariation)
      ? oldVariation
      : await variationService.set(oldVariation.id, newVariation)
  }))

  const oldExperience = await experienceService.get(propertyId, experienceId)
  let newExperience = experienceService.setCode(oldExperience, files)
  newExperience = pkgService.setCode(newExperience, files)
  const experience = eql(oldExperience, newExperience)
    ? oldExperience
    : await experienceService.set(propertyId, experienceId, newExperience)

  return { variations, experience }
}

function eql (a, b) {
  return _.isEqual(_.omit(a, ['meta']), _.omit(b, ['meta']))
}

function getCode (experience, variations) {
  const files = {}
  Object.assign(files, experienceService.getCode(experience), pkgService.getCode(experience, variations))
  variations.filter((v) => !v.is_control).map(variationService.getCode).forEach((v) => Object.assign(files, v))
  return files
}

module.exports = { get, set, getCode }
