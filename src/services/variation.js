const fetch = require('../lib/fetch')
const hasNoCode = require('../lib/hasNoCode')
const {
  execution_code: EXECUTION_CODE,
  custom_styles: CUSTOM_STYLES
} = require('@qubit/experience-defaults').custom
const iterationVariationsUrl = iterationId => `/api/iterations/${iterationId}/variations`
const variationsUrl = variationId => `/api/variations/${variationId}`

async function getAll (iterationId) {
  return fetch.get(iterationVariationsUrl(iterationId))
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

function remove (propertyId, experienceId, variationId) {
  return fetch.delete(variationsUrl(variationId))
}

function getCode (variation) {
  const code = {}
  const filename = getFilename(variation)
  // Automatically update old default js to new default js
  if (variation.execution_code === 'function (options) {}') delete variation.execution_code
  code[`${filename}.js`] = hasNoCode(variation.execution_code) ? EXECUTION_CODE : variation.execution_code
  code[`${filename}.css`] = hasNoCode(variation.custom_styles) ? CUSTOM_STYLES : variation.custom_styles
  return code
}

function setCode (variation, files) {
  const filename = getFilename(variation)
  return Object.assign({}, variation, {
    execution_code: hasNoCode(files[`${filename}.js`]) ? EXECUTION_CODE : files[`${filename}.js`],
    custom_styles: hasNoCode(files[`${filename}.css`]) ? CUSTOM_STYLES : files[`${filename}.css`]
  })
}

function getFilename (variation) {
  return `variation-${variation.master_id}`
}

module.exports = { getAll, get, set, create, remove, getCode, setCode, getFilename }
