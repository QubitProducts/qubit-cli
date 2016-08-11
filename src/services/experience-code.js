let scaffold = require('../lib/scaffold')
let experienceService = require('./experience')
let variationService = require('./variation')

function createPackageJson (experience) {
  return {
    name: experience.id,
    description: experience.name,
    meta: {
      domain: experience.domain,
      propertyId: experience.property_id,
      experienceId: experience.id,
      iterationId: experience.recent_iterations.draft.id
    }
  }
}

function get (domain, propertyId, experienceId) {
  return Promise.all([
    experienceService.get(domain, propertyId, experienceId),
    variationService.getAll(domain, propertyId, experienceId)
  ])
  .then(([experience, variations]) => {
    return Object.assign(experience, experienceService.extract(experience), {
      domain: domain,
      variations: variations.map((variation) => Object.assign({}, variation, variationService.extract(variation)))
    })
  })
}

function writeLocal (dest, domain, propertyId, experienceId) {
  return get(domain, propertyId, experienceId).then((experience) => {
    let files = {}
    files['package.json'] = JSON.stringify(createPackageJson(experience), null, 2)
    Object.assign(files, experienceService.extract(experience))
    experience.variations.forEach((variation) => Object.assign(files, variationService.extract(variation)))
    return scaffold(dest, files)
  })
}

function updateRemote (dest, experience, files) {
  return Promise.all([
    experienceService.update(
      experience.domain,
      experience.property_id,
      experience.id,
      files['global.js'],
      files['triggers.js']
    ),
    Promise.all(experience.variations.map((variation) => {
      return variationService.update(
        experience.domain,
        experience.property_id,
        experience.id,
        variation.id,
        variation.execution_code,
        variation.custom_styles
      )
    }))
  ])
}

module.exports = { writeLocal, updateRemote, get }
