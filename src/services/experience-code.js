const scaffold = require('../lib/scaffold')
const experienceService = require('./experience')
const variationService = require('./variation')

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

function writeLocal (dest, domain, propertyId, experienceId) {
  return experienceService.get(domain, propertyId, experienceId).then((experience) => {
    let files = {}
    files['package.json'] = JSON.stringify(createPackageJson(experience), null, 2)
    files['global.js'] = experience['global.js']
    files['triggers.js'] = experience['triggers.js']
    experience.variations.forEach((variation) => {
      if (!variation.control) {
        files[variationService.filename(variation)] = variation.code
        files[variationService.filename(variation)] = variation.css
      }
    })
    return scaffold(dest, files)
  })
}

function updateRemote (dest, experience, files) {
  return Promise.all([
    experienceService.update(
      experience.domain,
      experience.propertyId,
      experience.id,
      files['global.js'],
      files['triggers.js']
    ),
    Promise.all(experience.variations.map((variation) => {
      return variationService.update(
        experience.domain,
        experience.propertyId,
        experience.id,
        variation.id,
        files[variationFilename(variation) + '.js'],
        files[variationFilename(variation) + '.css']
      )
    }))
  ])
}

module.exports = { writeLocal, updateRemote }
