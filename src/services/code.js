const _ = require('lodash')
const experienceService = require('./experience')
const iterationService = require('./iteration')
const variationService = require('./variation')
const pkgService = require('./pkg')
const withMetrics = require('../lib/with-metrics')
const getUser = require('../lib/get-user')

async function get (propertyId, experienceId, isTemplate) {
  const experience = await experienceService.get(experienceId)
  const iterationId = experience.last_iteration_id
  const iteration = await iterationService.get(iterationId)
  const variations = await variationService.getAll(iterationId)
  return getCode(experience, iteration, variations, isTemplate)
}

async function set (propertyId, experienceId, files) {
  const oldExperience = await experienceService.get(experienceId)
  const iterationId = oldExperience.last_iteration_id
  const oldIteration = await iterationService.get(iterationId)
  let oldVariations = await variationService.getAll(iterationId)

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

  oldVariations = await variationService.getAll(iterationId)
  const variations = await Promise.all(oldVariations.map(async oldVariation => {
    if (oldVariation.is_control) return oldVariation
    let newVariation = variationService.setCode(oldVariation, files)
    // If we update iteration template_data we want to update variation too
    // (this is while we move iteration.template_data column to variations table)
    // todo: delete this line when we want to be able to push up changes to iteration data
    if (iteration.template_data) newVariation = { ...newVariation, template_data: iteration.template_data }
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
