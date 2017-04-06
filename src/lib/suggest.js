const propertyService = require('../services/property')
const experienceService = require('../services/experience')

async function getProperties () {
  const properties = await propertyService.get()

  return properties.map((property) => {
    return {
      title: property.name,
      value: property.id
    }
  })
}

async function getExperiences (propertyId) {
  const experiences = await experienceService.getAll(propertyId)

  return experiences.map((experience) => {
    return {
      title: experience.name,
      value: experience.id
    }
  })
}

function property (input, propertySuggestions) {
  return propertySuggestions.filter((property) => {
    return property.title.toLowerCase().slice(0, input.length) === input.toLowerCase()
  })
}

function experience (input, experienceSuggestions) {
  return experienceSuggestions.filter((experience) => {
    return experience.title.toLowerCase().slice(0, input.length) === input.toLowerCase()
  })
}

module.exports = { getProperties, getExperiences, property, experience }
