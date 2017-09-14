const fetch = require('../lib/fetch')
const EXECUTION = 'function execution (options) { // eslint-disable-line no-unused-vars\n\n}\n'
const CSS = ''
const DEFAULTS = { EXECUTION, CSS }

const experienceVariationsUrl = experienceId => `/api/experiences/${experienceId}/all-variations`
const iterationVariationsUrl = iterationId => `/api/iterations/${iterationId}/variations`
const variationsUrl = variationId => `/api/variations/${variationId}`

function getAll (experienceId) {
  return fetch.get(experienceVariationsUrl(experienceId))
}

function get (variationId) {
  return fetch.get(variationsUrl(variationId))
}

function set (variationId, variation) {
  delete variation.update_sequence_id
  return fetch.put(variationsUrl(variationId), { variation: variation })
}

function create (iterationId, data) {
  return fetch.post(iterationVariationsUrl(iterationId), { variation: data })
}

function getCode (variation) {
  const code = {}
  const filename = getFilename(variation)
  if (variation.execution_code === 'function (options) {}') delete variation.execution_code
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

function getFilename (variation) {
  return `variation-${variation.master_id}`
}

module.exports = { getAll, get, set, create, getCode, setCode, getFilename, DEFAULTS }
