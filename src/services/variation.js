let fetch = require('../lib/fetch')

function getAll (propertyId, experienceId) {
  return fetch.get(getPath(propertyId, experienceId))
}

function update (propertyId, experienceId, id, code, css) {
  return getAll(propertyId, experienceId)
    .then(find)
    .then(put)

  function find (variations) {
    return variations.find((variation) => variation.id === Number(id))
  }

  function put (variation) {
    let updated = {
      variation: Object.assign({}, variation, {
        execution_code: code,
        custom_styles: css
      })
    }
    return fetch.put(`${getPath(propertyId, experienceId)}/${id}`, updated)
  }
}

function extract (variation) {
  let obj = {}
  obj[`${filename(variation)}.js`] = variation.execution_code || 'function variation (cb) {\n\n}'
  obj[`${filename(variation)}.css`] = variation.custom_styles || ''
  return obj
}

function getPath (propertyId, experienceId) {
  return `/p/${propertyId}/smart_serve/experiments/${experienceId}/recent_iterations/draft/variations`
}

function filename (variation) {
  return `variation-${variation.master_id}`
}

module.exports = { getAll: getAll, update: update, extract, filename }
