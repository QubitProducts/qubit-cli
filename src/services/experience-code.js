let scaffold = require('../lib/scaffold')
let experienceService = require('./experience')
let variationService = require('./variation')
let pkg = require('./pkg')

function get (propertyId, experienceId) {
  return Promise.all([
    experienceService.get(propertyId, experienceId),
    variationService.getAll(propertyId, experienceId)
  ])
  .then(([experience, variations]) => {
    return Object.assign(experience, experienceService.extract(experience), {
      variations: variations.map((variation) => Object.assign({}, variation, variationService.extract(variation)))
    })
  })
}

function validateFiles (files) {
  pkg.validate(pkg.parse(files['package.json']))
  return files
}

function experienceHasChanged (experience, files) {
  return experience['global.js'] !== files['global.js'] ||
    experience['triggers.js'] !== files['triggers.js']
}

function variationHasChanged (variation, files) {
  let filename = variationService.filename(variation)
  return variation[filename + '.js'] !== files[filename + '.js'] ||
    variation[filename + '.css'] !== files[filename + '.css']
}

function writeToLocal (dest, propertyId, experienceId) {
  return get(propertyId, experienceId).then((experience) => {
    let files = {}
    files['package.json'] = JSON.stringify(pkg.create(experience), null, 2)
    Object.assign(files, experienceService.extract(experience))
    experience.variations.filter((v) => !v.is_control)
      .forEach((variation) => Object.assign(files, variationService.extract(variation)))
    return scaffold(dest, files)
  })
}

function update (dest, experience, files) {
  let updates = []
  if (experienceHasChanged(experience, files)) {
    updates.push(experienceService.update(
      experience.property_id,
      experience.id,
      files['global.js'],
      files['triggers.js']
    ))
  }
  experience.variations
    .filter((v) => !v.is_control && variationHasChanged(v, files))
    .forEach((variation) => {
      updates.push(
        variationService.update(
          experience.property_id,
          experience.id,
          variation.id,
          files[variationService.filename(variation) + '.js'],
          files[variationService.filename(variation) + '.css']
        )
      )
    })
  return Promise.all(updates)
}

module.exports = { update, writeToLocal, get, validateFiles }
