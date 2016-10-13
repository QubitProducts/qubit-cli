let _ = require('lodash')
let Joi = require('joi')

function create (experience) {
  const iterationId = _.get(experience, 'recent_iterations.draft.id')

  return {
    name: `qubit-experience-${experience.id}`,
    description: experience.name,
    meta: {
      propertyId: experience.property_id,
      experienceId: experience.id,
      iterationId: iterationId,
      variations: parseVariations(experience)
    }
  }
}

function parseVariations (experience) {
  const variations = experience.variations
  let parsedVariations = {}

  _.each(variations, (variation) => {
    parsedVariations[`variation-${variation.master_id}`] = {
      variationId: variation.id,
      variationIsControl: variation.is_control,
      variationMasterId: variation.master_id
    }
  })

  return parsedVariations
}

function validate (pkg) {
  let variations = Joi.object()

  _.forEach(pkg.variations, (variationData, variationMasterId) => {
    variations[pkg.variations[variationMasterId]] = Joi.object({
      variationId: Joi.number().required(),
      variationIsControl: Joi.boolean().required(),
      variationMasterId: Joi.number().required()
    }).required().unknown()
  })

  let schema = Joi.object({
    meta: Joi.object({
      propertyId: Joi.number().required(),
      experienceId: Joi.number().required(),
      iterationId: Joi.number(),
      variations: variations.required().unknown()
    }).required().unknown()
  }).required().unknown()

  Joi.assert(pkg, schema)
  return pkg
}

function parse (pkg) {
  return pkg ? JSON.parse(String(pkg)) : {}
}

module.exports = {parse, validate, create}
