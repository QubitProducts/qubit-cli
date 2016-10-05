let _ = require('lodash')
let Joi = require('joi')

function create (experience) {
  const iterations = experience.recent_iterations
  const iterationId = iterations && iterations.draft && iterations.draft.id

  return {
    name: `qubit-experience-${experience.id}`,
    description: experience.name,
    meta: {
      cookieDomain: experience.domain,
      propertyId: experience.property_id,
      experienceId: experience.id,
      iterationId: iterationId,
      variations: parseVariations(experience.variations, experience.domain, experience.id)
    }
  }
}

function parseVariations (variations, cookieDomain, experienceId) {
  let parsedVariations = {}

  _.each(variations, (variation) => {
    parsedVariations[`variation-${variation.master_id}`] = {
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
      variationIsControl: Joi.boolean().required(),
      variationMasterId: Joi.number().required()
    }).required().unknown()
  })

  let schema = Joi.object({
    meta: Joi.object({
      cookieDomain: Joi.string().required(),
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
