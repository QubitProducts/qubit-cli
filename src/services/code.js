const _ = require('lodash')
const experienceService = require('./experience')
const iterationService = require('./iteration')
const variationService = require('./variation')
const pkgService = require('./pkg')
const withMetrics = require('../lib/with-metrics')
const getUser = require('../lib/get-user')

async function get (propertyId, experienceId, isTemplate, namedIterationId) {
  const experience = await experienceService.get(experienceId)
  const iterationId = namedIterationId || experience.last_iteration_id
  const iteration = await iterationService.get(iterationId)
  const variations = await variationService.getAll(iterationId)
  return getCode(experience, iteration, variations, isTemplate)
}

async function set (propertyId, experienceId, files) {
  const oldExperience = await experienceService.get(experienceId)
  const iterationId = oldExperience.last_iteration_id
  const oldIteration = await iterationService.get(iterationId)
  const oldVariations = await variationService.getAll(iterationId)

  const pkg = (files['package.json'] && JSON.parse(files['package.json'])) || {}
  const user = await getUser()
  const newExperience = withMetrics(oldExperience, { ...user, templates: _.get(pkg, 'meta.templates') || [] })
  const newIteration = iterationService.setCode(oldIteration, files)
  const pkgCode = pkgService.setCode(newExperience, newIteration, files)

  const experience = eql(oldExperience, pkgCode.experience)
    ? oldExperience
    : await experienceService.set(experienceId, pkgCode.experience)

  const iteration = eql(oldIteration, pkgCode.iteration)
    ? oldIteration
    : await iterationService.set(iterationId, pkgCode.iteration)

  const variations = await Promise.all(oldVariations.map(async oldVariation => {
    if (oldVariation.is_control) return oldVariation
    const newVariation = variationService.setCode(oldVariation, files)
    return eql(oldVariation, newVariation)
      ? oldVariation
      : variationService.set(oldVariation.id, newVariation)
  }))

  return { experience, iteration, variations }
}

function eql (a, b) {
  return _.isEqual(a, b)
}

function getCode (experience, iteration, variations, isTemplate) {
  const files = {}
  Object.assign(files, iterationService.getCode(iteration), pkgService.getCode(experience, iteration, variations, isTemplate))
  variations.filter((v) => !v.is_control).map(variationService.getCode).forEach((v) => Object.assign(files, v))
  return files
}

module.exports = { get, set, getCode }
