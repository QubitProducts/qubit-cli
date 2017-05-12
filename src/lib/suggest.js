const autocomplete = require('cli-autocomplete')
const propertyService = require('../services/property')
const experienceService = require('../services/experience')

async function property (cb) {
  const suggestions = await getAutocompleteMap({
    arr: await propertyService.get(),
    title: 'name',
    value: 'id'
  })

  if (suggestions.length === 1) {
    cb(suggestions[0].id)
  } else {
    autocomplete('Select a property', (input) => {
      return filter(input, suggestions)
    }).on('submit', cb)
  }
}

async function experience (propertyId, cb) {
  const suggestions = await getAutocompleteMap({
    arr: await experienceService.getAll(propertyId),
    title: 'name',
    value: 'id'
  })

  autocomplete('Select an experience', (input) => {
    return filter(input, suggestions)
  }).on('submit', (experienceId) => {
    cb(propertyId, experienceId)
  })
}

async function getAutocompleteMap (data) {
  return data.arr.map((iteree) => {
    return {
      title: iteree[data.title],
      value: iteree[data.value]
    }
  })
}

function filter (input, suggestions) {
  return Promise.resolve(suggestions.filter((suggestion) => {
    return suggestion.title.toLowerCase().includes(input.toLowerCase())
  }))
}

module.exports = { property, experience }
