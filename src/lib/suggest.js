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
  return suggestions.filter((property) => {
    return property.title.toLowerCase().slice(0, input.length) === input.toLowerCase()
  })
}

module.exports = { getProperties, getExperiences, filter }
