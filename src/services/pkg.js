let Joi = require('joi')

function create (experience) {
  return {
    name: `qubit-experience-${experience.id}`,
    description: experience.name,
    meta: {
      domain: experience.domain,
      propertyId: experience.property_id,
      experienceId: experience.id
    }
  }
}

function validate (pkg) {
  let schema = Joi.object({
    meta: Joi.object({
      domain: Joi.string().required(),
      propertyId: Joi.number().required(),
      experienceId: Joi.number().required()
    }).required().unknown()
  }).required().unknown()
  Joi.assert(pkg, schema)
  return pkg
}

function parse (pkg) {
  return pkg ? JSON.parse(String(pkg)) : {}
}

module.exports = {parse, validate, create}
