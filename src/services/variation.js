const fetch = require('../lib/fetch')
const EXECUTION = 'function variation (cb) {\n\n}'
const CSS = ''
const DEFAULTS = { EXECUTION, CSS }

function getAll (propertyId, experienceId) {
  return fetch.get(getPath(propertyId, experienceId))
}

function get (propertyId, experienceId, variationId) {
  return fetch.get(getPath(propertyId, experienceId, variationId))
}

function set (propertyId, experienceId, variationId, val) {
  return fetch.put(getPath(propertyId, experienceId, variationId), { variation: val })
}

function getCode (variation) {
  const code = {}
  const filename = getFilename(variation)
  code[`${filename}.js`] = variation.execution_code || EXECUTION
  code[`${filename}.css`] = variation.custom_styles || CSS
  return code
}

function setCode (variation, files) {
  const filename = getFilename(variation)
  return Object.assign({}, variation, {
    execution_code: files[`${filename}.js`] || EXECUTION,
    custom_styles: files[`${filename}.css`] || CSS
  })
}

function getPath (propertyId, experienceId, variationId) {
  let path = `/p/${propertyId}/smart_serve/experiments/${experienceId}/recent_iterations/draft/variations`
  if (variationId) path += `/${variationId}`
  return path
}

function getFilename (variation) {
  return `variation-${variation.master_id}`
}

module.exports = { getAll, get, set, getCode, setCode, getFilename, DEFAULTS }
