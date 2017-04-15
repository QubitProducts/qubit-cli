const propertyService = require('../services/property')
const experienceService = require('../services/experience')

async function getProperties () {
  const properties = await propertyService.get()

  return getAutocompleteMap({
    arr: properties,
    title: 'name',
    value: 'id'
  })
}

async function getExperiences (propertyId) {
  const experiences = await experienceService.getAll(propertyId)

  return getAutocompleteMap({
    arr: experiences,
    title: 'name',
    value: 'id'
  })
}

function getAutocompleteMap (data) {
  return data.arr.map((iteree) => {
    return {
      title: iteree[data.title],
      value: iteree[data.value]
    }
  })
}

function filter (input, suggestions) {
  return Promise.resolve(suggestions.filter((property) => {
    return property.title.toLowerCase().includes(input.toLowerCase())
  }))
}

module.exports = { getProperties, getExperiences, filter }
