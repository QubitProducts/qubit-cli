let scaffold = require('../lib/scaffold')
let readFiles = require('../lib/read-files')
let {expect} = require('chai')
let experienceService = require('./experience')
let variationService = require('./variation')

function createPackageJson (experience) {
  return {
    name: experience.id,
    description: experience.name,
    meta: {
      domain: experience.domain,
      propertyId: experience.property_id,
      experienceId: experience.id
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

function down (dest, domain, propertyId, experienceId) {
  return get(domain, propertyId, experienceId).then((experience) => {
    let files = {}
    files['package.json'] = JSON.stringify(createPackageJson(experience), null, 2)
    Object.assign(files, experienceService.extract(experience))
    experience.variations.filter((v) => !v.is_control)
      .forEach((variation) => Object.assign(files, variationService.extract(variation)))
    return scaffold(dest, files)
  })
}

function validateFiles (files) {
  let pkg = JSON.parse(files['package.json'])
  expect(pkg).to.have.property('meta')
  expect(pkg.meta).to.contain.keys([
    'domain',
    'propertyId',
    'experienceId'
  ])
  expect(pkg.meta.domain).to.be.a('string')
  expect(pkg.meta.propertyId).to.be.a('number')
  expect(pkg.meta.experienceId).to.be.a('number')
  return files
}

function up (dest) {
  return readFiles(dest)
    .then(validateFiles)
    .then(function (files) {
      let {domain, propertyId, experienceId} = JSON.parse(files['package.json']).meta
      return get(domain, propertyId, experienceId).then((experience) => {
        return update(dest, experience, files)
      })
    })
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

function update (dest, experience, files) {
  let updates = []
  if (experienceHasChanged(experience, files)) {
    updates.push(experienceService.update(
      experience.domain,
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
          experience.domain,
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

module.exports = { down, update, up, get }
